
import { Bill } from '@/types/billing';
import { supabase } from '@/integrations/supabase/client';
import { CompanyInfo } from './types';
import { generateBillHtml } from './printBillContent';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Prints a bill by creating a new window with the bill content
 */
export const printBill = async (bill: Bill) => {
  try {
    // Obtain company information from the current user's profile
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    if (error) {
      console.error('Error al obtener los datos del perfil:', error);
      toast.error('Error al obtener información de la empresa');
      return;
    }
    
    const companyInfo: CompanyInfo = {
      name: profileData?.company_name || 'Mi Empresa',
      address: profileData?.company_address || 'Dirección no especificada',
      taxId: profileData?.company_tax_id || 'NIF/CIF no especificado',
      email: profileData?.company_email || '',
      phone: profileData?.company_phone || '',
      logo: profileData?.company_logo || ''
    };
    
    // Create a print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Por favor, permite las ventanas emergentes para imprimir la factura');
      return;
    }

    // Generate the bill HTML content
    const content = generateBillHtml(bill, companyInfo);

    // Write the content to the print window
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Add pdf export functionality
    printWindow.document.getElementById('export-pdf-btn')?.addEventListener('click', () => {
      exportToPdf(printWindow, bill.number);
    });
    
    // Wait for the window to fully load before enabling actions
    printWindow.onload = () => {
      printWindow.focus();
      
      // Load all images before printing
      const images = printWindow.document.querySelectorAll('img');
      if (images.length > 0) {
        let loadedImages = 0;
        images.forEach(img => {
          if (img.complete) {
            loadedImages++;
            if (loadedImages === images.length) {
              // All images loaded
              printWindow.document.getElementById('print-actions')?.classList.remove('hidden');
            }
          } else {
            img.onload = () => {
              loadedImages++;
              if (loadedImages === images.length) {
                // All images loaded
                printWindow.document.getElementById('print-actions')?.classList.remove('hidden');
              }
            };
            img.onerror = () => {
              loadedImages++;
              if (loadedImages === images.length) {
                // All images loaded (even with errors)
                printWindow.document.getElementById('print-actions')?.classList.remove('hidden');
              }
            };
          }
        });
      } else {
        printWindow.document.getElementById('print-actions')?.classList.remove('hidden');
      }
    };

  } catch (error) {
    console.error('Error al imprimir la factura:', error);
    toast.error('Ocurrió un error al preparar la factura para imprimir');
  }
};

/**
 * Exports the bill as a PDF
 */
const exportToPdf = async (printWindow: Window, billNumber: string) => {
  try {
    const contentDiv = printWindow.document.getElementById('print-content');
    if (!contentDiv) return;
    
    // Add loading indicator
    const loadingElement = printWindow.document.createElement('div');
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                  background: rgba(255,255,255,0.8); display: flex; 
                  justify-content: center; align-items: center; z-index: 9999">
        <div style="text-align: center;">
          <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                      border-radius: 50%; width: 40px; height: 40px; 
                      animation: spin 2s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 10px;">Generando PDF...</p>
        </div>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;
    printWindow.document.body.appendChild(loadingElement);
    
    // Hide buttons during PDF generation
    const actionsDiv = printWindow.document.getElementById('print-actions');
    if (actionsDiv) actionsDiv.style.display = 'none';
    
    // Wait a bit for the loading indicator to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Convert to canvas
    const canvas = await html2canvas(contentDiv, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
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
    pdf.save(`Factura_${billNumber.replace(/\//g, '-')}.pdf`);
    
    // Remove loading indicator and show buttons again
    printWindow.document.body.removeChild(loadingElement);
    if (actionsDiv) actionsDiv.style.display = 'block';
    
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    printWindow.alert('Error al generar el PDF. Por favor, intente de nuevo.');
    
    // Remove any loading indicator if there was an error
    const loadingElement = printWindow.document.querySelector('[style*="position: fixed"]');
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
    
    // Show buttons again
    const actionsDiv = printWindow.document.getElementById('print-actions');
    if (actionsDiv) actionsDiv.style.display = 'block';
  }
};
