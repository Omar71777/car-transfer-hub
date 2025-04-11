
import { Bill } from '@/types/billing';
import { downloadCSV } from './csvExport';
import { supabase } from '@/integrations/supabase/client';

/**
 * Exporta una factura a CSV
 */
export const exportBillCsv = (bill: Bill) => {
  const headers = ['Concepto', 'Cantidad', 'Precio unitario', 'Total'];
  
  const rows = bill.items.map(item => {
    // Create the main item row
    const mainRow = [
      item.description,
      item.quantity.toString(),
      item.unit_price.toString(),
      item.total_price.toString()
    ];
    
    // Add extra charge rows if they exist
    const extraRows = item.extra_charges ? item.extra_charges.map(charge => [
      `  ${charge.name}`, // Indent to show hierarchy
      '1',
      charge.price.toString(),
      charge.price.toString()
    ]) : [];
    
    return [mainRow, ...extraRows];
  }).flat(); // Flatten the nested arrays
  
  // Añadir filas de resumen
  rows.push(['', '', 'Subtotal', bill.sub_total.toString()]);
  rows.push(['', '', `IVA (${bill.tax_rate}%)`, bill.tax_amount.toString()]);
  rows.push(['', '', 'Total', bill.total.toString()]);
  
  const fileName = `factura-${bill.number}.csv`;
  downloadCSV(headers, rows, fileName);
};

/**
 * Imprime una factura
 */
export const printBill = async (bill: Bill) => {
  try {
    // Obtener información de la empresa del usuario actual
    const { data: profileData, error } = await supabase.from('profiles').select('*').eq('id', (await supabase.auth.getUser()).data.user?.id).single();
    
    if (error) {
      console.error('Error al obtener los datos del perfil:', error);
      return;
    }
    
    const companyInfo = {
      name: profileData?.company_name || 'Mi Empresa',
      address: profileData?.company_address || 'Dirección no especificada',
      taxId: profileData?.company_tax_id || 'NIF/CIF no especificado',
      email: profileData?.company_email || '',
      phone: profileData?.company_phone || '',
      logo: profileData?.company_logo || ''
    };
    
    // Crear una ventana de impresión
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes para imprimir la factura');
      return;
    }

    // Formatear moneda
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    // Create the items HTML with indented extra charges
    const itemsHTML = bill.items.map(item => {
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

    // Generar contenido HTML para la impresión
    const content = `
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

    // Escribir el contenido en la ventana de impresión
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Esperar a que la ventana se cargue completamente antes de imprimir
    printWindow.onload = () => {
      printWindow.focus();
      // Imprimir automáticamente
      setTimeout(() => printWindow.print(), 500);
    };
  } catch (error) {
    console.error('Error al imprimir la factura:', error);
    alert('Ocurrió un error al preparar la factura para imprimir.');
  }
};
