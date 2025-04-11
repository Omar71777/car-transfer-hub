
import { Bill } from '@/types/billing';
import { CompanyInfo } from '../types';
import { formatCurrency } from '../utils/formatters';
import { generateItemsHtml } from './itemsSection';
import { getStatusBadge } from './statusBadge';
import { generateStyles } from './styles';

/**
 * Generates the complete HTML content for printing a bill
 */
export const generateBillHtml = (bill: Bill, companyInfo: CompanyInfo): string => {
  // Ensure bill has items array (defensive programming)
  if (!bill.items) {
    bill.items = [];
    console.error('Bill items array is missing:', bill);
  }
  
  // Debug what we're working with
  console.log('Generating bill HTML with:', { 
    billId: bill.id, 
    itemsCount: bill.items?.length || 0,
    hasClient: !!bill.client
  });
  
  const itemsHTML = generateItemsHtml(bill);
  const stylesHTML = generateStyles();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Factura ${bill.number}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      ${stylesHTML}
    </head>
    <body>
      <div id="print-content" class="print-container">
        <div class="document-header">
          <div class="header-left">
            <h1 class="header-title">FACTURA</h1>
            <p class="header-subtitle">Nº ${bill.number}</p>
          </div>
          <div class="header-right" style="text-align: right;">
            ${getStatusBadge(bill.status)}
          </div>
        </div>
        
        <div class="details-row">
          <div class="detail-card">
            <h3>Empresa</h3>
            ${companyInfo.logo ? `<img src="${companyInfo.logo}" class="company-logo" alt="Logo" />` : ''}
            <p class="company-name">${companyInfo.name}</p>
            <p>${companyInfo.address}</p>
            <p>CIF/NIF: ${companyInfo.taxId}</p>
            ${companyInfo.email ? `<p>Email: ${companyInfo.email}</p>` : ''}
            ${companyInfo.phone ? `<p>Tel: ${companyInfo.phone}</p>` : ''}
          </div>
          
          <div class="detail-card">
            <h3>Cliente</h3>
            <p class="client-name">${bill.client?.name || 'Cliente'}</p>
            ${bill.client?.address ? `<p>${bill.client.address}</p>` : ''}
            ${bill.client?.tax_id ? `<p>CIF/NIF: ${bill.client.tax_id}</p>` : ''}
            ${bill.client?.email ? `<p>Email: ${bill.client.email}</p>` : ''}
            ${bill.client?.phone ? `<p>Tel: ${bill.client.phone}</p>` : ''}
          </div>
          
          <div class="detail-card">
            <h3>Detalles de facturación</h3>
            <p><strong>Fecha de emisión:</strong> ${formatDateForBill(bill.date)}</p>
            <p><strong>Fecha de vencimiento:</strong> ${formatDateForBill(bill.due_date)}</p>
          </div>
        </div>
        
        <div class="items-section">
          <h3 class="section-title">Servicios facturados</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 50%;">Concepto</th>
                <th>Cantidad</th>
                <th class="text-right">Precio unitario</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>
        
        <div class="totals-section">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td class="text-right">${formatCurrency(bill.sub_total)}</td>
            </tr>
            <tr>
              <td>IVA (${bill.tax_rate}%)${bill.tax_application === 'included' ? ' (incluido)' : ''}:</td>
              <td class="text-right">${formatCurrency(bill.tax_amount)}</td>
            </tr>
            <tr class="total-row">
              <td>Total:</td>
              <td class="text-right">${formatCurrency(bill.total)}</td>
            </tr>
          </table>
        </div>
        
        ${bill.notes ? `
          <div class="notes-section">
            <h3 class="notes-title">Notas</h3>
            <p>${bill.notes}</p>
          </div>
        ` : ''}
      </div>

      <div id="print-actions" class="print-actions hidden">
        <button onclick="window.print();" class="btn">Imprimir</button>
        <button id="export-pdf-btn" class="btn btn-secondary">Exportar PDF</button>
      </div>
      
      <script>
        // Add primary color RGB for background opacity
        document.documentElement.style.setProperty(
          '--primary-color-rgb', 
          getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
            .trim()
            .match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
            ?.slice(1)
            .map(val => parseInt(val, 16))
            .join(', ') || '14, 165, 233'
        );
        
        // Force light mode for the document
        document.documentElement.style.colorScheme = 'light';
        document.body.style.backgroundColor = 'white';
      </script>
    </body>
    </html>
  `;
};

/**
 * Formats date strings for bill display
 */
function formatDateForBill(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
}
