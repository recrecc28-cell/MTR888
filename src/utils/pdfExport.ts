import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Clean up cloned element before html2canvas rendering:
 * - Removes interactive buttons and inputs (.no-print)
 * - Converts input/textarea to styled text nodes for crisp rendering
 * - Preserves signatures and images
 */
function prepareClonedElement(clonedElement: HTMLElement, clonedDoc: Document): void {
  // Remove buttons and interactive hints
  const noPrints = clonedElement.querySelectorAll('.no-print');
  noPrints.forEach((el) => el.remove());

  // Convert all input and textarea elements into text nodes
  const formInputs = clonedElement.querySelectorAll('input, textarea');
  formInputs.forEach((input: any) => {
    const textValue = input.value || '';
    const span = clonedDoc.createElement('span');
    span.innerText = textValue;

    try {
      const computedStyle = window.getComputedStyle(input);
      span.style.fontFamily = computedStyle.fontFamily;
      span.style.fontSize = computedStyle.fontSize;
      span.style.fontWeight = computedStyle.fontWeight;
      span.style.lineHeight = computedStyle.lineHeight;
      span.style.color = computedStyle.color;
      span.style.textAlign = computedStyle.textAlign;
    } catch {
      // Fallback styling
      span.style.fontSize = '10px';
      span.style.color = '#000000';
    }

    span.style.whiteSpace = 'pre-line';
    span.style.display = 'inline-block';
    span.style.width = '100%';

    if (input.parentNode) {
      input.parentNode.replaceChild(span, input);
    }
  });

  // Ensure all image elements (like signatures) have explicit crossOrigin and display
  const images = clonedElement.querySelectorAll('img');
  images.forEach((img) => {
    img.setAttribute('crossOrigin', 'anonymous');
    img.style.maxWidth = '100%';
  });
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
  const pdfWidth = 297; // mm
  const pdfHeight = 210; // mm
  const marginX = 4; // 4mm safety margin
  const marginY = 4; // 4mm safety margin
  const usableWidth = pdfWidth - marginX * 2;
  const usableHeight = pdfHeight - marginY * 2;

  if (!isFirstPage) {
    pdf.addPage('a4', 'landscape');
  }

  const imgData = canvas.toDataURL('image/png', 1.0);
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
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`找不到 PDF 報告元件 (ID: ${elementId})`);
  }

  const canvas = await html2canvas(element, {
    scale: 2, // High resolution (300 DPI equivalent)
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    windowWidth: 1150,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        prepareClonedElement(clonedElement, clonedDoc);
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
  pdf.save(fileName);
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
): Promise<void> {
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

    // If specific export canvas element not found, try fallback
    if (!element) {
      element = document.getElementById(`pdf-station-${elId.replace('export-canvas-', '')}`);
    }
    if (!element) continue;

    if (onProgress) {
      onProgress(i + 1, elementIds.length);
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1150,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elId) || clonedDoc.getElementById(element!.id);
          if (clonedElement) {
            prepareClonedElement(clonedElement, clonedDoc);
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

  pdf.save(fileName);
}
