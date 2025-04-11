
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

/**
 * Exports HTML content to PDF using html2canvas and jsPDF
 */
export const exportHtmlToPdf = async (
  contentElement: HTMLElement,
  fileName: string,
  loadingCallback?: (isLoading: boolean) => void
): Promise<boolean> => {
  try {
    if (loadingCallback) loadingCallback(true);
    
    // Apply temporary styles to force white background
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'white';
    
    // Apply white background to the element
    const elementsToFix = contentElement.querySelectorAll('*');
    const originalStyles: Map<Element, { bg: string, color: string }> = new Map();
    
    // Store original styles and apply white background
    elementsToFix.forEach(el => {
      const style = window.getComputedStyle(el);
      originalStyles.set(el, {
        bg: style.backgroundColor,
        color: style.color
      });
      
      if (style.backgroundColor === 'rgba(0, 0, 0, 0)' || 
          style.backgroundColor === 'transparent' ||
          style.backgroundColor.includes('rgba(0, 0, 0, 0.')) {
        (el as HTMLElement).style.backgroundColor = 'white';
      }
    });
    
    // Convert to canvas
    const canvas = await html2canvas(contentElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white'
    });
    
    // Calculate dimensions
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasRatio = canvas.height / canvas.width;
    const pdfImgWidth = pdfWidth;
    const pdfImgHeight = pdfWidth * canvasRatio;
    
    // If image is longer than a page, use multiple pages
    if (pdfImgHeight > pdfHeight) {
      // Calculate how many pages needed
      const numPages = Math.ceil(pdfImgHeight / pdfHeight);
      let heightLeft = pdfImgHeight;
      let position = 0;
      
      // Add each canvas part to its own page
      for (let i = 0; i < numPages; i++) {
        // Add new page except for first page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of canvas to use for this page
        const heightToPrint = Math.min(pdfHeight, heightLeft);
        const ratio = heightToPrint / pdfImgHeight;
        const canvasSliceHeight = canvas.height * ratio;
        
        // Create a new canvas for the slice
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = canvasSliceHeight;
        const ctx = sliceCanvas.getContext('2d');
        
        if (ctx) {
          // Draw the slice of the original canvas
          ctx.drawImage(
            canvas, 
            0, position * canvas.height, 
            canvas.width, canvasSliceHeight,
            0, 0, 
            sliceCanvas.width, sliceCanvas.height
          );
          
          // Add to PDF
          const sliceImgData = sliceCanvas.toDataURL('image/png');
          pdf.addImage(sliceImgData, 'PNG', 0, 0, pdfWidth, heightToPrint);
          
          // Update for next page
          heightLeft -= heightToPrint;
          position += ratio;
        }
      }
    } else {
      // Just add the whole image if it fits on one page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImgHeight);
    }
    
    // Save PDF
    pdf.save(fileName);
    
    // Restore original styles
    document.body.style.backgroundColor = originalBg;
    elementsToFix.forEach(el => {
      const original = originalStyles.get(el);
      if (original) {
        (el as HTMLElement).style.backgroundColor = '';
      }
    });
    
    if (loadingCallback) loadingCallback(false);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast.error('Error generating PDF. Please try again.');
    if (loadingCallback) loadingCallback(false);
    return false;
  }
};
