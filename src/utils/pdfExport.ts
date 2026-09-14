import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPdf(
  elementId: string,
  fileName: string = 'MTR_PM_Performance_Report.pdf',
  orientation: 'landscape' | 'portrait' = 'landscape'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('找不到 PDF 預覽元件');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High DPI scaling
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Remove elements marked as no-print from cloned DOM
          const noPrints = clonedElement.querySelectorAll('.no-print');
          noPrints.forEach((el) => el.remove());

          // Convert all input and textarea elements into text nodes so html2canvas renders them cleanly
          const formInputs = clonedElement.querySelectorAll('input, textarea');
          formInputs.forEach((input: any) => {
            const textValue = input.value || '';
            const span = clonedDoc.createElement('span');
            span.innerText = textValue;
            
            // Inherit text styling
            const computedStyle = window.getComputedStyle(input);
            span.style.fontFamily = computedStyle.fontFamily;
            span.style.fontSize = computedStyle.fontSize;
            span.style.fontWeight = computedStyle.fontWeight;
            span.style.lineHeight = computedStyle.lineHeight;
            span.style.color = computedStyle.color;
            span.style.textAlign = computedStyle.textAlign;
            span.style.whiteSpace = 'pre-line';
            span.style.display = 'inline-block';
            span.style.width = '100%';

            if (input.parentNode) {
              input.parentNode.replaceChild(span, input);
            }
          });
        }
      },
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // A4 dimensions in mm
    const pdfWidth = orientation === 'landscape' ? 297 : 210;
    const pdfHeight = orientation === 'landscape' ? 210 : 297;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
    pdf.save(fileName);
  } catch (err) {
    console.error('Export PDF error:', err);
    // Fallback to native window.print() if html2canvas/jsPDF fails
    window.print();
  }
}

export function printDocument(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;
  // Trigger native browser print directly (no popup blocking)
  window.print();
}
