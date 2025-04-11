
import { Bill } from '@/types/billing';
import { CompanyInfo } from './types';

/**
 * Formats currency values
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

/**
 * Generates HTML content for bill items
 */
export const generateItemsHtml = (bill: Bill): string => {
  return bill.items.map(item => {
    // Main item row
    let html = `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td class="text-right">${formatCurrency(item.unit_price)}</td>
        <td class="text-right">${formatCurrency(item.total_price)}</td>
      </tr>
    `;
    
    // Add extra charges if they exist
    if (item.extra_charges && item.extra_charges.length > 0) {
      item.extra_charges.forEach(charge => {
        html += `
          <tr class="extra-charge-row">
            <td style="padding-left: 20px; font-style: italic; color: #666;">
              ${charge.name}
            </td>
            <td>1</td>
            <td class="text-right">${formatCurrency(charge.price)}</td>
            <td class="text-right">${formatCurrency(charge.price)}</td>
          </tr>
        `;
      });
    }
    
    return html;
  }).join('');
};

/**
 * Generates the complete HTML content for printing a bill
 */
export const generateBillHtml = (bill: Bill, companyInfo: CompanyInfo): string => {
  const itemsHTML = generateItemsHtml(bill);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Factura ${bill.number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .invoice-details { margin-bottom: 20px; }
        .client-details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .total-row { font-weight: bold; }
        .notes { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
        .company-logo { max-width: 150px; max-height: 100px; margin-bottom: 10px; }
        .extra-charge-row { background-color: #f9f9f9; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div>
          <div class="invoice-title">FACTURA</div>
          <div>Nº: ${bill.number}</div>
          <div>Fecha: ${bill.date}</div>
          <div>Vencimiento: ${bill.due_date}</div>
        </div>
        <div>
          ${companyInfo.logo ? `<img src="${companyInfo.logo}" class="company-logo" alt="Logo" />` : ''}
          <div><strong>${companyInfo.name}</strong></div>
          <div>${companyInfo.address}</div>
          <div>CIF/NIF: ${companyInfo.taxId}</div>
          ${companyInfo.email ? `<div>Email: ${companyInfo.email}</div>` : ''}
          ${companyInfo.phone ? `<div>Tel: ${companyInfo.phone}</div>` : ''}
        </div>
      </div>

      <div class="client-details">
        <div><strong>Cliente:</strong></div>
        <div>${bill.client?.name || ''}</div>
        <div>${bill.client?.address || ''}</div>
        <div>${bill.client?.tax_id ? `CIF/NIF: ${bill.client.tax_id}` : ''}</div>
        <div>${bill.client?.email || ''}</div>
        <div>${bill.client?.phone || ''}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-right">Subtotal:</td>
            <td class="text-right">${formatCurrency(bill.sub_total)}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-right">IVA (${bill.tax_rate}%)${bill.tax_application === 'included' ? ' (incluido)' : ''}:</td>
            <td class="text-right">${formatCurrency(bill.tax_amount)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" class="text-right">Total:</td>
            <td class="text-right">${formatCurrency(bill.total)}</td>
          </tr>
        </tfoot>
      </table>

      ${bill.notes ? `
        <div class="notes">
          <div><strong>Notas:</strong></div>
          <div>${bill.notes}</div>
        </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center;">
        <button onclick="window.print();" style="padding: 10px 20px;">Imprimir Factura</button>
      </div>
    </body>
    </html>
  `;
};
