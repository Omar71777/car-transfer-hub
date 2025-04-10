
import { Bill } from '@/types/billing';

export const printBill = (bill: Bill, userInfo?: { name: string; email: string }) => {
  if (!bill) return;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Create a new window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita ventanas emergentes para imprimir la factura.');
    return;
  }

  // Get current date for footer
  const currentDate = new Date().toLocaleDateString('es-ES');

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Factura ${bill.number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .invoice-header h1 {
          color: #2563eb;
          margin-bottom: 5px;
        }
        .invoice-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-info-section {
          width: 48%;
        }
        .invoice-info-section h3 {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        table th, table td {
          border: 1px solid #e2e8f0;
          padding: 10px;
        }
        table th {
          background-color: #f1f5f9;
          text-align: left;
        }
        table td {
          text-align: left;
        }
        table td.right {
          text-align: right;
        }
        .totals {
          width: 300px;
          margin-left: auto;
          margin-bottom: 30px;
        }
        .totals div {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .totals .total {
          font-weight: bold;
          border-top: 2px solid #e2e8f0;
          padding-top: 10px;
        }
        .notes {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f8fafc;
          border-radius: 5px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
        @media print {
          body {
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
        }
        .print-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print();">Imprimir</button>
      
      <div class="invoice-header">
        <h1>FACTURA</h1>
        <p>Nº ${bill.number}</p>
      </div>
      
      <div class="invoice-info">
        <div class="invoice-info-section">
          <h3>De:</h3>
          <p><strong>${userInfo?.name || 'Su Empresa'}</strong></p>
          <p>${userInfo?.email || 'email@suempresa.com'}</p>
        </div>
        
        <div class="invoice-info-section">
          <h3>Para:</h3>
          <p><strong>${bill.client?.name || 'Cliente'}</strong></p>
          <p>${bill.client?.email || ''}</p>
          <p>${bill.client?.address || ''}</p>
          ${bill.client?.taxId ? `<p>NIF/CIF: ${bill.client.taxId}</p>` : ''}
        </div>
      </div>
      
      <div class="invoice-info">
        <div class="invoice-info-section">
          <h3>Detalles de la factura:</h3>
          <p><strong>Fecha de emisión:</strong> ${bill.date}</p>
          <p><strong>Fecha de vencimiento:</strong> ${bill.dueDate}</p>
          <p><strong>Estado:</strong> ${
            bill.status === 'draft' ? 'Borrador' :
            bill.status === 'sent' ? 'Enviada' :
            bill.status === 'paid' ? 'Pagada' : 'Cancelada'
          }</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${bill.items?.map(item => `
            <tr>
              <td>${item.description}</td>
              <td class="right">${item.quantity}</td>
              <td class="right">${formatCurrency(item.unitPrice)}</td>
              <td class="right">${formatCurrency(item.totalPrice)}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>
      
      <div class="totals">
        <div>
          <span>Subtotal:</span>
          <span>${formatCurrency(bill.subTotal)}</span>
        </div>
        <div>
          <span>IVA (${bill.taxRate}%)${bill.taxApplication === 'included' ? ' (incluido)' : ''}:</span>
          <span>${formatCurrency(bill.taxAmount)}</span>
        </div>
        <div class="total">
          <span>Total:</span>
          <span>${formatCurrency(bill.total)}</span>
        </div>
      </div>
      
      ${bill.notes ? `
        <div class="notes">
          <h3>Notas:</h3>
          <p>${bill.notes}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Factura generada el ${currentDate}</p>
      </div>
    </body>
    </html>
  `;

  // Write to the new window and print
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for resources to load then print
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

export const exportBillCsv = (bills: Bill[]) => {
  const formatCurrency = (amount: number) => amount.toFixed(2);
  
  const headers = [
    'Número',
    'Cliente',
    'Fecha',
    'Vencimiento',
    'Subtotal',
    'IVA',
    'Total',
    'Estado',
  ].join(',');
  
  const rows = bills.map(bill => [
    bill.number,
    `"${bill.client?.name || ''}"`,
    bill.date,
    bill.dueDate,
    formatCurrency(bill.subTotal),
    formatCurrency(bill.taxAmount),
    formatCurrency(bill.total),
    bill.status === 'draft' ? 'Borrador' :
    bill.status === 'sent' ? 'Enviada' :
    bill.status === 'paid' ? 'Pagada' : 'Cancelada',
  ].join(','));
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `facturas-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
