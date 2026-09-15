import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Clean up cloned element before html2canvas rendering:
 * - Removes interactive buttons and controls (.no-print)
 * - Preserves typed input and textarea values as HTML attributes
 * - Pre-normalizes images for clean rendering
 */
function cleanClonedDocument(clonedDoc: Document | HTMLElement): void {
  // Remove buttons, edit tooltips, and interactive hints
  const noPrints = clonedDoc.querySelectorAll('.no-print');
  noPrints.forEach((el) => el.remove());

  // Set input and textarea values as attributes so html2canvas renders typed text faithfully
  const formInputs = clonedDoc.querySelectorAll('input');
  formInputs.forEach((input: any) => {
    input.setAttribute('value', input.value || '');
  });

  const textareas = clonedDoc.querySelectorAll('textarea');
  textareas.forEach((ta: any) => {
    ta.textContent = ta.value || '';
  });

  // Ensure image tags do not throw CORS or break rendering
  const images = clonedDoc.querySelectorAll('img');
  images.forEach((img: any) => {
    img.crossOrigin = 'anonymous';
    img.loading = 'eager';
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
 * Finds the actual paper report element by station code or generic ID
 */
function resolveStationElement(idOrCode: string): HTMLElement | null {
  // 1. Direct match
  let el = document.getElementById(idOrCode);
  if (el) return el;

  const stnCode = idOrCode.replace(/^pdf-paper-|^station-wrapper-|^pdf-station-|^export-canvas-/, '');

  // 2. Exact paper sheet ID
  el =
    document.getElementById(`pdf-paper-${stnCode}`) ||
    document.getElementById(`report-paper-${stnCode}`) ||
    document.getElementById(`pdf-station-${stnCode}`);
  if (el) return el;

  // 3. Data attribute
  el = document.querySelector(`[data-station="${stnCode}"]`) as HTMLElement;
  if (el) return el;

  // 4. Fallback generic
  el =
    document.getElementById('pdf-report-canvas') ||
    (document.querySelector('.report-paper-sheet') as HTMLElement) ||
    (document.querySelector('.station-pdf-page') as HTMLElement);

  return el;
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
  const element = resolveStationElement(elementId);

  if (!element) {
    throw new Error(`找不到 PDF 報告元件 (ID: ${elementId})，請確認頁面已顯示該站點報告`);
  }

  let canvas: HTMLCanvasElement | null = null;

  try {
    canvas = await html2canvas(element, {
      scale: 1.5, // Crisp print quality
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1150,
      onclone: (clonedDoc) => {
        cleanClonedDocument(clonedDoc);
      },
    });
  } catch (primaryErr) {
    console.warn(`Primary canvas render error for ${elementId}, running safe fallback:`, primaryErr);
    canvas = await html2canvas(element, {
      scale: 1.0,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        cleanClonedDocument(clonedDoc);
      },
    });
  }

  if (!canvas) {
    throw new Error('無法擷取頁面畫面，請重試或使用瀏覽器「列印 / 另存 PDF」功能');
  }

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
  // If elementIds is empty, try to auto-discover all rendered report pages on DOM
  let targetElements: HTMLElement[] = [];

  if (elementIds && elementIds.length > 0) {
    elementIds.forEach((elId) => {
      const el = resolveStationElement(elId);
      if (el && !targetElements.includes(el)) {
        targetElements.push(el);
      }
    });
  }

  // Fallback: auto-query DOM if specific IDs yielded nothing
  if (targetElements.length === 0) {
    const discovered = document.querySelectorAll<HTMLElement>(
      '.station-pdf-page, .report-paper-sheet, [id^="pdf-paper-"], [id^="pdf-station-"]'
    );
    discovered.forEach((el) => {
      if (!targetElements.includes(el)) {
        targetElements.push(el);
      }
    });
  }

  if (targetElements.length === 0) {
    throw new Error('畫面上未找到任何站點報表，請確認各站點資料是否已載入');
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  let renderedPagesCount = 0;

  for (let i = 0; i < targetElements.length; i++) {
    const element = targetElements[i];

    if (onProgress) {
      onProgress(i + 1, targetElements.length);
    }

    // Brief tick to allow browser UI thread to update progress bar
    await new Promise((resolve) => setTimeout(resolve, 60));

    let canvas: HTMLCanvasElement | null = null;

    try {
      canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1150,
        onclone: (clonedDoc) => {
          cleanClonedDocument(clonedDoc);
        },
      });
    } catch (primaryErr) {
      console.warn(`Primary canvas render error for element ${i}, trying fallback:`, primaryErr);
      try {
        canvas = await html2canvas(element, {
          scale: 1.0,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            cleanClonedDocument(clonedDoc);
          },
        });
      } catch (fallbackErr) {
        console.error(`Fallback canvas render also failed for element ${i}:`, fallbackErr);
      }
    }

    if (canvas) {
      try {
        addCanvasToPdfPage(pdf, canvas, renderedPagesCount === 0);
        renderedPagesCount++;
      } catch (addErr) {
        console.error(`Failed to append canvas to PDF page for element ${i}:`, addErr);
      }
    }
  }

  if (renderedPagesCount === 0) {
    throw new Error('未能擷取站點內容，請確認各站點資料或改用「列印 / 另存 PDF」功能');
  }

  const { blob, blobUrl } = downloadPdfDocument(pdf, fileName);

  return {
    blob,
    blobUrl,
    fileName,
    pageCount: renderedPagesCount,
  };
}
