import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Clean up cloned element before html2canvas rendering:
 * - Removes interactive buttons and controls (.no-print)
 * - Preserves typed input and textarea values as HTML attributes
 */
function prepareClonedElement(clonedElement: HTMLElement): void {
  // Remove buttons, edit tooltips, and interactive hints
  const noPrints = clonedElement.querySelectorAll('.no-print');
  noPrints.forEach((el) => el.remove());

  // Set input and textarea values as attributes so html2canvas renders typed text faithfully
  const formInputs = clonedElement.querySelectorAll('input');
  formInputs.forEach((input: any) => {
    input.setAttribute('value', input.value || '');
  });

  const textareas = clonedElement.querySelectorAll('textarea');
  textareas.forEach((ta: any) => {
    ta.textContent = ta.value || '';
  });
}

export interface ExportPdfResult {
  blob: Blob;
  blobUrl: string;
  fileName: string;
  pageCount: number;
}

/**
 * Downloads a jsPDF instance cleanly in both standalone and iframe environments,
 * returning the blob and blobUrl for direct link download / preview modals.
 */
function downloadPdfDocument(pdf: jsPDF, fileName: string): { blob: Blob; blobUrl: string } {
  const blob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  // Attempt automatic browser download
  try {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }, 1000);
  } catch (err) {
    console.warn('Silent download attempt error, falling back to pdf.save():', err);
    try {
      pdf.save(fileName);
    } catch (saveErr) {
      console.warn('pdf.save failed:', saveErr);
    }
  }

  return { blob, blobUrl };
}

/**
 * Adds a rendered canvas as an exact single A4 Landscape page (297mm x 210mm),
 * auto-scaling so that all content (including signatures and staff info) fits strictly
 * on 1 page without being clipped or overflowing.
 */
function addCanvasToPdfPage(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  isFirstPage: boolean = false
): void {
  const pdfWidth = 297; // mm (A4 Landscape)
  const pdfHeight = 210; // mm
  const marginX = 4; // 4mm safety margin
  const marginY = 4; // 4mm safety margin
  const usableWidth = pdfWidth - marginX * 2;
  const usableHeight = pdfHeight - marginY * 2;

  if (!isFirstPage) {
    pdf.addPage('a4', 'landscape');
  }

  const imgData = canvas.toDataURL('image/png', 0.95);
  const canvasRatio = canvas.width / canvas.height;

  let renderWidth = usableWidth;
  let renderHeight = usableWidth / canvasRatio;

  // Auto-shrink if total height exceeds A4 height
  if (renderHeight > usableHeight) {
    renderHeight = usableHeight;
    renderWidth = usableHeight * canvasRatio;
  }

  // Center on page
  const xOffset = marginX + (usableWidth - renderWidth) / 2;
  const yOffset = marginY + (usableHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight, undefined, 'FAST');
}

/**
 * Downloads a single station report as an A4 Landscape PDF.
 * Auto-scales to fit 1 station into 1 page, including all signatures and staff details.
 */
export async function exportToPdf(
  elementId: string,
  fileName: string = 'MTR_PM_Performance_Report.pdf',
  _orientation: 'landscape' | 'portrait' = 'landscape'
): Promise<ExportPdfResult> {
  let element = document.getElementById(elementId);
  if (!element) {
    // Try smart fallbacks for single station
    const stnCode = elementId.replace('pdf-paper-', '').replace('station-wrapper-', '').replace('pdf-station-', '');
    element =
      document.getElementById(`pdf-paper-${stnCode}`) ||
      document.getElementById(`pdf-station-${stnCode}`) ||
      document.getElementById('pdf-report-canvas') ||
      document.querySelector('.station-pdf-page') as HTMLElement;
  }

  if (!element) {
    throw new Error(`找不到 PDF 報告元件 (ID: ${elementId})`);
  }

  const canvas = await html2canvas(element, {
    scale: 1.5, // Crisp 220+ DPI print quality with fast rendering & low memory
    useCORS: true,
    allowTaint: false, // Must be FALSE to prevent tainted canvas SecurityError
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    windowWidth: 1150,
    onclone: (clonedDoc) => {
      const targetId = element!.id;
      const clonedElement = targetId ? clonedDoc.getElementById(targetId) : null;
      if (clonedElement) {
        prepareClonedElement(clonedElement);
      }
    },
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  addCanvasToPdfPage(pdf, canvas, true);
  const { blob, blobUrl } = downloadPdfDocument(pdf, fileName);

  return {
    blob,
    blobUrl,
    fileName,
    pageCount: 1,
  };
}

/**
 * Downloads multiple station reports into a single PDF document.
 * Strictly formats each station as exactly 1 dedicated A4 page (一站一頁).
 */
export async function exportAllStationsToPdf(
  elementIds: string[],
  fileName: string = 'MTR_PM_Reports_All_Stations.pdf',
  _orientation: 'landscape' | 'portrait' = 'landscape',
  onProgress?: (current: number, total: number) => void
): Promise<ExportPdfResult> {
  if (!elementIds || elementIds.length === 0) {
    throw new Error('未指定任何站點進行 PDF 下載');
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  let renderedPagesCount = 0;

  for (let i = 0; i < elementIds.length; i++) {
    const elId = elementIds[i];
    let element = document.getElementById(elId);

    // If specific export canvas element not found, try fallback patterns
    if (!element) {
      const stnCode = elId.replace('pdf-paper-', '').replace('station-wrapper-', '').replace('pdf-station-', '').replace('export-canvas-', '');
      element =
        document.getElementById(`pdf-paper-${stnCode}`) ||
        document.getElementById(`pdf-station-${stnCode}`) ||
        document.getElementById(`station-wrapper-${stnCode}`) ||
        document.getElementById(`export-canvas-${stnCode}`);
    }
    if (!element) continue;

    if (onProgress) {
      onProgress(i + 1, elementIds.length);
    }

    // Brief tick to allow browser UI thread to update progress
    await new Promise((resolve) => setTimeout(resolve, 60));

    try {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false, // Critical: must be false so canvas is not tainted
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1150,
        onclone: (clonedDoc) => {
          const targetId = element!.id;
          const clonedElement = targetId ? clonedDoc.getElementById(targetId) : null;
          if (clonedElement) {
            prepareClonedElement(clonedElement);
          }
        },
      });

      addCanvasToPdfPage(pdf, canvas, renderedPagesCount === 0);
      renderedPagesCount++;
    } catch (err) {
      console.warn(`Failed to render station ${elId} to PDF canvas:`, err);
    }
  }

  if (renderedPagesCount === 0) {
    throw new Error('未能擷取站點內容，請確認各站點資料');
  }

  const { blob, blobUrl } = downloadPdfDocument(pdf, fileName);

  return {
    blob,
    blobUrl,
    fileName,
    pageCount: renderedPagesCount,
  };
}
