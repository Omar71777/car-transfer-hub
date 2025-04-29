
import { addPrintStyles, printDocument, printElement } from './index';
import { toast } from 'sonner';

// Base interface for print options
export interface PrintOptions {
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showCompanyInfo?: boolean;
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'letter';
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

// Enhanced options for HTML content
export interface HtmlPrintOptions extends PrintOptions {
  fileName?: string;
  showPdfExport?: boolean;
}

/**
 * Creates a print window with standardized styling and functionality
 */
export function createPrintWindow(
  title: string, 
  options: HtmlPrintOptions = {}
): Window | null {
  try {
    // Create print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Por favor, permite las ventanas emergentes para imprimir');
      return null;
    }
    
    // Generate base HTML structure
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light">
          <style>
            ${getPrintWindowStyles(options)}
          </style>
        </head>
        <body>
          <div id="print-content" class="print-container">
            ${options.showHeader !== false ? `
              <div class="document-header">
                <div class="header-left">
                  <h1 class="header-title">${title}</h1>
                  ${options.subtitle ? `<p class="header-subtitle">${options.subtitle}</p>` : ''}
                </div>
                <div class="header-right">
                  <p class="date">${new Date().toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            ` : ''}
            
            <div id="content-placeholder"></div>
            
            ${options.showFooter !== false ? `
              <div class="document-footer">
                <p>Impreso el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
              </div>
            ` : ''}
          </div>

          <div id="print-actions" class="print-actions">
            <button onclick="window.print();" class="btn">Imprimir</button>
            ${options.showPdfExport !== false ? `
              <button id="export-pdf-btn" class="btn btn-secondary">Exportar PDF</button>
            ` : ''}
          </div>
          
          <script>
            // Force light mode for printing
            document.documentElement.style.colorScheme = 'light';
            document.body.style.backgroundColor = 'white';
            
            // Add print media support
            window.onafterprint = function() {
              document.body.style.pointerEvents = 'auto';
            };
            
            // Handle images
            window.onload = function() {
              const images = document.querySelectorAll('img');
              if (images.length > 0) {
                let loadedImages = 0;
                
                images.forEach(img => {
                  if (img.complete) {
                    loadedImages++;
                    if (loadedImages === images.length) {
                      document.getElementById('print-actions').classList.remove('hidden');
                    }
                  } else {
                    img.onload = () => {
                      loadedImages++;
                      if (loadedImages === images.length) {
                        document.getElementById('print-actions').classList.remove('hidden');
                      }
                    };
                    img.onerror = () => {
                      loadedImages++;
                      if (loadedImages === images.length) {
                        document.getElementById('print-actions').classList.remove('hidden');
                      }
                    };
                  }
                });
              } else {
                document.getElementById('print-actions').classList.remove('hidden');
              }
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    return printWindow;
  } catch (error) {
    console.error('Error creating print window:', error);
    toast.error('Error al crear la ventana de impresión');
    return null;
  }
}

/**
 * Print HTML content in a standardized format
 */
export function printHtmlContent(
  content: HTMLElement | string, 
  title: string,
  options: HtmlPrintOptions = {}
): void {
  const printWindow = createPrintWindow(title, options);
  if (!printWindow) return;
  
  try {
    // Wait for the window to be ready
    setTimeout(() => {
      const contentPlaceholder = printWindow.document.getElementById('content-placeholder');
      if (!contentPlaceholder) {
        throw new Error('Content placeholder not found');
      }
      
      // Insert the content
      if (typeof content === 'string') {
        contentPlaceholder.innerHTML = content;
      } else {
        const contentClone = content.cloneNode(true) as HTMLElement;
        contentPlaceholder.appendChild(contentClone);
      }
      
      // Setup PDF export if enabled
      if (options.showPdfExport !== false && options.fileName) {
        const { exportToA4Pdf } = require('../exports/pdf-export/a4PdfExporter');
        const pdfButton = printWindow.document.getElementById('export-pdf-btn');
        
        if (pdfButton) {
          pdfButton.addEventListener('click', async () => {
            const printContent = printWindow.document.getElementById('print-content');
            if (!printContent) return;
            
            // Create loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.innerHTML = `
              <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                          background: rgba(255,255,255,0.9); display: flex; 
                          justify-content: center; align-items: center; z-index: 9999">
                <div style="text-align: center; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                              border-radius: 50%; width: 40px; height: 40px; 
                              animation: spin 2s linear infinite; margin: 0 auto;"></div>
                  <p style="margin-top: 10px; font-family: sans-serif;">Generando PDF...</p>
                </div>
              </div>
              <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              </style>
            `;
            printWindow.document.body.appendChild(loadingElement);
            
            try {
              await exportToA4Pdf(printContent, {
                fileName: options.fileName,
                loadingCallback: (isLoading) => {
                  if (!isLoading && loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                  }
                },
                showToasts: true,
                orientation: options.orientation || 'portrait',
                quality: 2.5
              });
            } catch (error) {
              console.error('Error exporting to PDF:', error);
              if (loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
              }
              printWindow.alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
            }
          });
        }
      }
      
      if (options.onSuccess) {
        options.onSuccess();
      }
    }, 200);
  } catch (error) {
    console.error('Error rendering print content:', error);
    if (options.onError) {
      options.onError(error);
    } else {
      toast.error('Error al preparar el contenido para imprimir');
    }
  }
}

/**
 * Generate standardized print styles
 */
function getPrintWindowStyles(options: PrintOptions = {}): string {
  return `
    /* Base styles */
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: white;
      margin: 0;
      padding: 20px;
    }
    
    /* Print container */
    .print-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      opacity: 1;
      transition: opacity 0.2s;
    }
    
    /* Headers and footers */
    .document-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 10px;
      border-bottom: 2px solid #eaeaea;
    }
    
    .header-title {
      font-size: 28px;
      font-weight: bold;
      color: #2563eb;
      margin: 0 0 5px 0;
    }
    
    .header-subtitle {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
    
    .document-footer {
      margin-top: 40px;
      padding-top: 10px;
      border-top: 1px solid #eaeaea;
      font-size: 12px;
      text-align: center;
      color: #666;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    
    table.items-table {
      page-break-inside: auto;
    }
    
    table.items-table thead {
      display: table-header-group;
    }
    
    table.items-table tfoot {
      display: table-footer-group;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    
    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    
    tr:nth-child(even) {
      background-color: #f8fafd;
    }
    
    .text-right {
      text-align: right;
    }
    
    .font-bold {
      font-weight: bold;
    }
    
    /* Cards and sections */
    .card {
      border: 1px solid #eaeaea;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 20px;
      background: #fff;
    }
    
    .card-title {
      font-size: 18px;
      font-weight: bold;
      margin-top: 0;
      margin-bottom: 10px;
      color: #2563eb;
    }
    
    /* Action buttons */
    .print-actions {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }
    
    .btn {
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    
    .btn:hover {
      background-color: #1d4ed8;
    }
    
    .btn-secondary {
      background-color: #6b7280;
    }
    
    .btn-secondary:hover {
      background-color: #4b5563;
    }
    
    .hidden {
      display: none;
    }
    
    /* Status badges */
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .status-paid {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    
    .status-draft {
      background-color: #e5e7eb;
      color: #4b5563;
    }
    
    .status-cancelled {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    /* Summary and totals */
    .summary-section {
      background-color: #f9fafb;
      border: 1px solid #eaeaea;
      border-radius: 5px;
      padding: 15px;
      margin: 20px 0;
    }
    
    .totals-table {
      width: auto;
      margin-left: auto;
      border: none;
    }
    
    .totals-table td {
      border: none;
      padding: 5px 0;
    }
    
    .totals-table tr.total-row td {
      font-weight: bold;
      font-size: 16px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }
    
    /* Print media styles */
    @page {
      size: ${options.paperSize || 'A4'} ${options.orientation || 'portrait'};
      margin: 10mm;
    }
    
    @media print {
      body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background-color: white;
      }
      
      .print-container {
        width: 190mm;
        margin: 0 auto;
        padding: 10mm 0;
        box-shadow: none;
        border: none;
      }
      
      .print-actions, .no-print {
        display: none !important;
      }
      
      .page-break {
        page-break-before: always;
      }
      
      .keep-together {
        page-break-inside: avoid;
      }
      
      /* Ensure tables don't break across pages inappropriately */
      table {
        page-break-inside: avoid;
      }
    }
  `;
}
