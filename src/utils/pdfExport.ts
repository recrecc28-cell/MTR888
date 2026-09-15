import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Clean up cloned element before html2canvas rendering:
 * - Removes interactive buttons and controls (.no-print)
 * - Preserves typed input and textarea values as HTML attributes
 * - Pre-normalizes images for clean rendering
 */
function cleanClonedDocument(clonedDoc: Document | HTMLElement): void {
  // 1. Remove non-printable elements (buttons, popups, tooltips)
  const noPrints = clonedDoc.querySelectorAll('.no-print');
  noPrints.forEach((el) => el.remove());

  // 2. Convert all textareas to plain <div> elements
  // This completely eliminates native textarea scrollbars, stepper controls, and `<>` glyphs
  const textareas = clonedDoc.querySelectorAll('textarea');
  textareas.forEach((ta: any) => {
    const textVal = ta.value || ta.textContent || '';
    const div = document.createElement('div');
    div.textContent = textVal;
    div.className = ta.className || '';
    div.setAttribute('style', ta.getAttribute('style') || '');
    // Ensure multiline wrapping into 2 lines if long, with zero scrollbars
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordBreak = 'break-word';
    div.style.overflow = 'hidden';
    div.style.resize = 'none';
    div.style.scrollbarWidth = 'none';
    div.style.setProperty('-ms-overflow-style', 'none');
    div.style.display = 'block';
    div.style.width = '100%';
    div.style.lineHeight = '1.25';
    div.style.border = 'none';
    div.style.background = 'transparent';
    div.style.padding = '0';
    div.style.margin = '0';
    ta.parentNode?.replaceChild(div, ta);
  });

  // 3. Convert all input elements to clean <span> so no input borders, arrows, or native scrollbars render
  const formInputs = clonedDoc.querySelectorAll('input');
  formInputs.forEach((inp: any) => {
    const textVal = inp.value || inp.getAttribute('value') || '';
    const span = document.createElement('span');
    span.textContent = textVal;
    span.className = inp.className || '';
    span.setAttribute('style', inp.getAttribute('style') || '');
    span.style.whiteSpace = 'pre-wrap';
    span.style.wordBreak = 'break-word';
    span.style.overflow = 'hidden';
    span.style.border = 'none';
    span.style.background = 'transparent';
    span.style.outline = 'none';
    span.style.display = 'inline-block';
    span.style.width = '100%';
    inp.parentNode?.replaceChild(span, inp);
  });

  // 4. Ensure image tags do not throw CORS or break rendering
  const images = clonedDoc.querySelectorAll('img');
  images.forEach((img: any) => {
    img.crossOrigin = 'anonymous';
    img.loading = 'eager';
  });

  // 5. Hide all scrollbars across all elements in the cloned document
  const allEls = clonedDoc.querySelectorAll('*');
  allEls.forEach((el: any) => {
    if (el.style) {
      el.style.scrollbarWidth = 'none';
      el.style.setProperty('-ms-overflow-style', 'none');
      if (el.style.overflow === 'auto' || el.style.overflow === 'scroll') {
        el.style.overflow = 'hidden';
      }
      if (el.style.overflowX === 'auto' || el.style.overflowX === 'scroll') {
        el.style.overflowX = 'hidden';
      }
      if (el.style.overflowY === 'auto' || el.style.overflowY === 'scroll') {
        el.style.overflowY = 'hidden';
      }
    }
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
