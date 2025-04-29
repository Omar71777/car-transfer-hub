
import { Bill } from '@/types/billing';
import { CompanyInfo } from './types';
import { generateBillHtml } from './content';
import { exportHtmlToPdf } from './billPdfExporter';
import { toast } from 'sonner';

/**
 * Creates and manages a print window for a bill
 */
export const createPrintWindow = (bill: Bill, companyInfo: CompanyInfo): Window | null => {
  // Create a print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Please allow pop-ups to print the bill');
    return null;
  }

  // Debug the bill data before generating HTML
  console.log('Creating print window with bill:', {
    id: bill.id,
    number: bill.number,
    itemsCount: bill.items?.length || 0,
    hasClient: !!bill.client,
    items: bill.items?.map(item => ({
      id: item.id,
      description: item.description,
      is_extra_charge: item.is_extra_charge
    }))
  });

  // Generate and write the bill HTML content
  const content = generateBillHtml(bill, companyInfo);
  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();

  return printWindow;
};

/**
 * Sets up event listeners and loading handlers for the print window
 */
export const setupPrintWindowEvents = (printWindow: Window, bill: Bill): void => {
  // Wait for the window to fully load before enabling actions
  printWindow.onload = () => {
    setupImageLoading(printWindow);
    
    // Make print content visible
    const printContent = printWindow.document.getElementById('print-content');
    if (printContent) {
      printContent.style.opacity = '1';
      
      // Add A4 page format for proper printing
      const style = printWindow.document.createElement('style');
      style.textContent = `
        @page {
          size: A4;
          margin: 10mm;
        }
        
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          #print-content {
            width: 190mm;
            padding: 10mm 0;
            margin: 0 auto;
          }
          .no-print {
            display: none !important;
          }
          #print-actions {
            display: none !important;
          }
        }
      `;
      printWindow.document.head.appendChild(style);
    }
    
    // Add pdf export functionality
    printWindow.document.getElementById('export-pdf-btn')?.addEventListener('click', () => {
      handlePdfExport(printWindow, bill.number);
    });
    
    // Add print instruction
    const printInfo = printWindow.document.createElement('div');
    printInfo.className = 'text-center text-sm text-gray-500 mt-4 no-print';
    printInfo.innerHTML = `
      Para obtener el mejor resultado, seleccione A4 como tamaño de papel y deshabilite encabezados y pies de página.
    `;
    printWindow.document.body.appendChild(printInfo);
  };
};

/**
 * Handles PDF export from the print window
 */
const handlePdfExport = async (printWindow: Window, billNumber: string): Promise<void> => {
  const contentDiv = printWindow.document.getElementById('print-content');
  if (!contentDiv) return;
  
  // Add loading indicator
  const loadingElement = createLoadingIndicator(printWindow);
  printWindow.document.body.appendChild(loadingElement);
  
  // Hide buttons during PDF generation
  const actionsDiv = printWindow.document.getElementById('print-actions');
  if (actionsDiv) actionsDiv.style.display = 'none';
  
  // Wait a bit for the loading indicator to render
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    // Export to PDF with A4 format
    const success = await exportHtmlToPdf(
      contentDiv, 
      `Factura_${billNumber.replace(/\//g, '-')}.pdf`,
      isLoading => {
        if (!isLoading && loadingElement && loadingElement.parentNode) {
          loadingElement.parentNode.removeChild(loadingElement);
        }
      }
    );
    
    if (!success) {
      printWindow.alert('Error generating PDF. Please try again.');
    }
  } finally {
    // Clean up UI whether successful or not
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
    
    if (actionsDiv) actionsDiv.style.display = 'block';
  }
};

/**
 * Creates a loading indicator element
 */
const createLoadingIndicator = (window: Window): HTMLDivElement => {
  const loadingElement = window.document.createElement('div');
  loadingElement.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                background: rgba(255,255,255,0.9); display: flex; 
                justify-content: center; align-items: center; z-index: 9999">
      <div style="text-align: center; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                    border-radius: 50%; width: 40px; height: 40px; 
                    animation: spin 2s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 10px; font-family: sans-serif;">Generating PDF...</p>
      </div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;
  return loadingElement;
};

/**
 * Sets up image loading logic for the print window
 */
const setupImageLoading = (printWindow: Window): void => {
  const images = printWindow.document.querySelectorAll('img');
  if (images.length > 0) {
    let loadedImages = 0;
    
    const checkAllImagesLoaded = () => {
      if (loadedImages === images.length) {
        // All images loaded
        printWindow.document.getElementById('print-actions')?.classList.remove('hidden');
      }
    };

    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
        checkAllImagesLoaded();
      } else {
        img.onload = () => {
          loadedImages++;
          checkAllImagesLoaded();
        };
        img.onerror = () => {
          loadedImages++;
          checkAllImagesLoaded();
        };
      }
    });
  } else {
    printWindow.document.getElementById('print-actions')?.classList.remove('hidden');
  }
};
