
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Margins in mm
const MARGIN_MM = 10;

// Content area dimensions (accounting for margins)
const CONTENT_WIDTH_MM = A4_WIDTH_MM - (MARGIN_MM * 2);
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - (MARGIN_MM * 2);

export interface PdfExportOptions {
  fileName: string;
  title?: string;
  orientation?: 'portrait' | 'landscape';
  loadingCallback?: (isLoading: boolean) => void;
  showToasts?: boolean;
  quality?: number;
  pageBreakSelector?: string;
  useWorker?: boolean;
}

/**
 * Enhanced PDF Exporter that properly handles A4 paper format and pagination
 */
export const exportToA4Pdf = async (
  contentElement: HTMLElement,
  options: PdfExportOptions
): Promise<boolean> => {
  try {
    // Set default options
    const {
      fileName,
      title = '',
      orientation = 'portrait',
      loadingCallback,
      showToasts = true,
      quality = 2.5,
      pageBreakSelector,
      useWorker = false
    } = options;
    
    // Show loading state
    if (loadingCallback) loadingCallback(true);
    if (showToasts) toast.loading('Generando PDF...');
    
    // Create PDF document with proper A4 dimensions
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Get the width and height of the PDF document
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add title if provided
    if (title) {
      pdf.setFontSize(16);
      pdf.text(title, pdfWidth / 2, 20, { align: 'center' });
    }

    // Clone element if using page break selector to avoid modifying the original
    let elementToRender = contentElement;
    let pageBreakElements: HTMLElement[] = [];
    
    if (pageBreakSelector) {
      // Find elements that should trigger page breaks
      pageBreakElements = Array.from(contentElement.querySelectorAll<HTMLElement>(pageBreakSelector));
      if (pageBreakElements.length > 0) {
        return await handlePageBreaks(contentElement, pageBreakElements, pdf, options);
      }
    }
    
    // Generate high-quality canvas
    const canvas = await html2canvas(elementToRender, {
      scale: quality,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white',
      imageTimeout: 15000,
      removeContainer: false,
      foreignObjectRendering: useWorker
    });

    // Calculate the proper scaling to fit A4
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const canvasRatio = canvas.height / canvas.width;
    const pdfImgWidth = CONTENT_WIDTH_MM;
    const pdfImgHeight = pdfImgWidth * canvasRatio;
    
    // Handle content that exceeds one page
    if (pdfImgHeight > CONTENT_HEIGHT_MM) {
      await handleMultiPageContent(canvas, pdf, options);
    } else {
      // Content fits on one page
      pdf.addImage(
        imgData, 
        'PNG', 
        MARGIN_MM,
        MARGIN_MM + (title ? 10 : 0), 
        pdfImgWidth, 
        pdfImgHeight
      );
    }
    
    // Save the PDF
    pdf.save(fileName);
    
    // Clear loading state
    if (loadingCallback) loadingCallback(false);
    if (showToasts) {
      toast.dismiss();
      toast.success('PDF exportado correctamente');
    }
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    
    // Clear loading state and show error
    if (loadingCallback) loadingCallback(false);
    if (showToasts) {
      toast.dismiss();
      toast.error('Error al generar PDF. Inténtalo de nuevo.');
    }
    
    return false;
  }
};

/**
 * Handles content that spans multiple pages
 */
async function handleMultiPageContent(
  canvas: HTMLCanvasElement, 
  pdf: jsPDF,
  options: PdfExportOptions
): Promise<void> {
  const { title } = options;
  const titleOffset = title ? 10 : 0;
  
  // Calculate how many pages needed
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Content area (accounting for margins)
  const contentWidth = pdfWidth - (MARGIN_MM * 2);
  const contentHeight = pdfHeight - (MARGIN_MM * 2) - titleOffset;
  
  // Calculate scaling
  const canvasRatio = canvas.height / canvas.width;
  const pdfImgWidth = contentWidth;
  const totalImgHeight = pdfImgWidth * canvasRatio;
  
  // Calculate number of pages needed
  const numPages = Math.ceil(totalImgHeight / contentHeight);
  
  // Add each canvas part to its own page
  let heightLeft = totalImgHeight;
  let position = 0;
  
  for (let i = 0; i < numPages; i++) {
    // Add new page except for first page
    if (i > 0) {
      pdf.addPage();
    }
    
    // Calculate current page slice height
    const heightToPrint = Math.min(contentHeight, heightLeft);
    const ratio = heightToPrint / totalImgHeight;
    const canvasSliceHeight = canvas.height * ratio;
    
    // Create slice canvas
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = canvasSliceHeight;
    const ctx = sliceCanvas.getContext('2d');
    
    if (ctx) {
      // Draw slice of original canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(
        canvas, 
        0, position * canvas.height, 
        canvas.width, canvasSliceHeight,
        0, 0, 
        sliceCanvas.width, sliceCanvas.height
      );
      
      // Add to PDF with proper margins
      const sliceImgData = sliceCanvas.toDataURL('image/png');
      pdf.addImage(
        sliceImgData, 
        'PNG', 
        MARGIN_MM, 
        MARGIN_MM + (i === 0 ? titleOffset : 0), 
        contentWidth, 
        heightToPrint
      );
      
      // Update for next page
      heightLeft -= heightToPrint;
      position += ratio;
    }
  }
}

/**
 * Handles content with explicit page breaks
 */
async function handlePageBreaks(
  contentElement: HTMLElement,
  breakElements: HTMLElement[],
  pdf: jsPDF,
  options: PdfExportOptions
): Promise<boolean> {
  try {
    const { title, quality = 2.5 } = options;
    const titleOffset = title ? 10 : 0;

    // Create document clone to work with
    const contentClone = contentElement.cloneNode(true) as HTMLElement;
    document.body.appendChild(contentClone);
    contentClone.style.position = 'absolute';
    contentClone.style.left = '-9999px';
    contentClone.style.top = '-9999px';
    
    // Initialize parameters
    let currentPage = 0;
    const breakPoints = [];
    
    // Find original break elements positions
    for (const el of breakElements) {
      const rect = el.getBoundingClientRect();
      const parentRect = contentElement.getBoundingClientRect();
      
      breakPoints.push({
        element: el,
        top: rect.top - parentRect.top,
        height: rect.height
      });
    }
    
    // Sort break points by position
    breakPoints.sort((a, b) => a.top - b.top);
    
    // Add first page
    let currentCanvas = await html2canvas(contentClone, {
      scale: quality,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white',
      height: breakPoints[0]?.top || contentClone.scrollHeight
    });
    
    // Add first page content
    addCanvasToPdf(currentCanvas, pdf, {
      x: MARGIN_MM,
      y: MARGIN_MM + titleOffset,
      width: CONTENT_WIDTH_MM
    });
    
    // Add remaining pages
    for (let i = 0; i < breakPoints.length; i++) {
      // Add new page
      pdf.addPage();
      currentPage++;
      
      // Calculate height for this section
      const startY = breakPoints[i].top;
      const endY = breakPoints[i+1]?.top || contentClone.scrollHeight;
      const height = endY - startY;
      
      // Create canvas for this section
      currentCanvas = await html2canvas(contentClone, {
        scale: quality,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
        y: startY,
        height: height
      });
      
      // Add to PDF
      addCanvasToPdf(currentCanvas, pdf, {
        x: MARGIN_MM,
        y: MARGIN_MM,
        width: CONTENT_WIDTH_MM
      });
    }
    
    // Clean up
    document.body.removeChild(contentClone);
    return true;
  } catch (error) {
    console.error('Error processing page breaks:', error);
    return false;
  }
}

/**
 * Helper function to add a canvas to the PDF
 */
function addCanvasToPdf(
  canvas: HTMLCanvasElement, 
  pdf: jsPDF, 
  placement: { x: number, y: number, width: number }
): void {
  const imgData = canvas.toDataURL('image/png', 1.0);
  const { x, y, width } = placement;
  
  // Calculate height based on aspect ratio
  const aspectRatio = canvas.height / canvas.width;
  const height = width * aspectRatio;
  
  pdf.addImage(imgData, 'PNG', x, y, width, height);
}
