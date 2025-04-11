
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
    
    // Force white background on the document
    const htmlElement = contentElement.ownerDocument.documentElement;
    htmlElement.style.colorScheme = 'light';
    
    // Apply temporary styles to force white background
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'white';
    
    // Create a clone of the content to modify without affecting the original
    const contentClone = contentElement.cloneNode(true) as HTMLElement;
    document.body.appendChild(contentClone);
    
    // Apply white background to the element and all its children
    contentClone.style.backgroundColor = 'white';
    contentClone.style.color = '#1e293b';
    
    // Preserve table styling and ensure extra charge rows maintain their styling
    const extraChargeRows = contentClone.querySelectorAll('.extra-charge-row');
    extraChargeRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        // Ensure the first cell has the correct indentation styling
        cells[0].style.paddingLeft = '20px';
        cells[0].style.fontStyle = 'italic';
        cells[0].style.color = '#666';
      }
    });
    
    const elementsToFix = contentClone.querySelectorAll('*');
    elementsToFix.forEach(el => {
      const htmlEl = el as HTMLElement;
      
      // Force backgrounds to white
      const computedStyle = window.getComputedStyle(htmlEl);
      if (computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || 
          computedStyle.backgroundColor === 'transparent' ||
          computedStyle.backgroundColor.includes('rgba(0, 0, 0, 0.')) {
        htmlEl.style.backgroundColor = 'white';
      }
      
      // Force text color to be visible
      if (computedStyle.color.includes('rgba(255, 255, 255') || 
          computedStyle.color === 'rgb(255, 255, 255)') {
        htmlEl.style.color = '#1e293b';
      }
    });
    
    // Convert to canvas with better quality settings
    const canvas = await html2canvas(contentClone, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white',
      imageTimeout: 15000,
      removeContainer: false
    });
    
    // Calculate dimensions
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasRatio = canvas.height / canvas.width;
    const pdfImgWidth = pdfWidth - 10; // Margins
    const pdfImgHeight = pdfImgWidth * canvasRatio;
    
    // If image is longer than a page, use multiple pages
    if (pdfImgHeight > pdfHeight - 20) { // Account for margins
      // Calculate how many pages needed
      const numPages = Math.ceil(pdfImgHeight / (pdfHeight - 20));
      let heightLeft = pdfImgHeight;
      let position = 0;
      
      // Add each canvas part to its own page
      for (let i = 0; i < numPages; i++) {
        // Add new page except for first page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of canvas to use for this page
        const heightToPrint = Math.min(pdfHeight - 20, heightLeft);
        const ratio = heightToPrint / pdfImgHeight;
        const canvasSliceHeight = canvas.height * ratio;
        
        // Create a new canvas for the slice
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = canvasSliceHeight;
        const ctx = sliceCanvas.getContext('2d');
        
        if (ctx) {
          // Draw the slice of the original canvas
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas, 
            0, position * canvas.height, 
            canvas.width, canvasSliceHeight,
            0, 0, 
            sliceCanvas.width, sliceCanvas.height
          );
          
          // Add to PDF with margins
          const sliceImgData = sliceCanvas.toDataURL('image/png', 1.0);
          pdf.addImage(sliceImgData, 'PNG', 5, 10, pdfImgWidth, heightToPrint);
          
          // Update for next page
          heightLeft -= heightToPrint;
          position += ratio;
        }
      }
    } else {
      // Just add the whole image if it fits on one page
      pdf.addImage(imgData, 'PNG', 5, 10, pdfImgWidth, pdfImgHeight);
    }
    
    // Save PDF
    pdf.save(fileName);
    
    // Clean up
    document.body.style.backgroundColor = originalBg;
    if (contentClone.parentNode) {
      contentClone.parentNode.removeChild(contentClone);
    }
    
    if (loadingCallback) loadingCallback(false);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast.error('Error generating PDF. Please try again.');
    if (loadingCallback) loadingCallback(false);
    return false;
  }
};
