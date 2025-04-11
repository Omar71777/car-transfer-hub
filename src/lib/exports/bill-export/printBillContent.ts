
import { Bill } from '@/types/billing';
import { CompanyInfo } from './types';
import { formatDateForBill } from '@/lib/billing/calculationUtils';

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
    // Determine if this is a main item or an extra charge
    const isExtraCharge = item.is_extra_charge;
    
    // Main item row
    let html = `
      <tr${isExtraCharge ? ' class="extra-charge-row"' : ''}>
        <td${isExtraCharge ? ' style="padding-left: 20px; font-style: italic; color: #666;"' : ''}>${item.description}</td>
        <td>${item.quantity}</td>
        <td class="text-right">${formatCurrency(item.unit_price)}</td>
        <td class="text-right">${formatCurrency(item.total_price)}</td>
      </tr>
    `;
    
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        :root {
          --primary-color: #0ea5e9;
          --border-color: #e2e8f0;
          --bg-color: #ffffff;
          --text-color: #1e293b;
          --muted-color: #64748b;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        @media (prefers-color-scheme: dark) {
          :root {
            --primary-color: #38bdf8;
            --border-color: #334155;
            --bg-color: #0f172a;
            --text-color: #f8fafc;
            --muted-color: #94a3b8;
            --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
          }
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 20px;
          color: var(--text-color);
          background-color: var(--bg-color);
        }
        
        .print-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: var(--card-shadow);
          background-color: var(--bg-color);
        }
        
        .document-header {
          display: flex;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--primary-color);
          margin-bottom: 30px;
        }
        
        .header-left, .header-right {
          display: flex;
          flex-direction: column;
        }
        
        .header-title {
          color: var(--primary-color);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 5px;
          margin-top: 0;
        }
        
        .header-subtitle {
          font-size: 1rem;
          color: var(--muted-color);
          margin-top: 0;
        }
        
        .company-details, .client-details {
          margin-bottom: 20px;
        }
        
        .company-logo {
          max-width: 150px;
          max-height: 80px;
          margin-bottom: 10px;
        }
        
        .company-name, .client-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 5px;
          margin-top: 0;
        }
        
        .details-row {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        
        .detail-card {
          background-color: rgba(var(--primary-color-rgb), 0.05);
          border-radius: 8px;
          padding: 15px;
          flex: 1;
          min-width: 200px;
          margin-right: 15px;
          margin-bottom: 15px;
        }
        
        .detail-card h3 {
          margin-top: 0;
          font-size: 1rem;
          color: var(--primary-color);
          margin-bottom: 10px;
        }
        
        .detail-card p {
          margin: 0;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .items-table th {
          border-bottom: 2px solid var(--border-color);
          padding: 12px 8px;
          text-align: left;
          color: var(--primary-color);
        }
        
        .items-table td {
          border-bottom: 1px solid var(--border-color);
          padding: 12px 8px;
        }
        
        .items-table tr:last-child td {
          border-bottom: none;
        }
        
        .text-right {
          text-align: right;
        }
        
        .extra-charge-row {
          background-color: rgba(var(--primary-color-rgb), 0.03);
        }
        
        .totals-section {
          margin-top: 20px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
        
        .totals-table {
          width: 100%;
          max-width: 400px;
          margin-left: auto;
        }
        
        .totals-table td {
          padding: 8px 0;
        }
        
        .totals-table .total-row {
          font-weight: bold;
          color: var(--primary-color);
          font-size: 1.1rem;
        }
        
        .notes-section {
          margin-top: 30px;
          padding: 15px;
          background-color: rgba(var(--primary-color-rgb), 0.05);
          border-radius: 8px;
        }
        
        .notes-title {
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 10px;
          color: var(--primary-color);
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .status-draft {
          background-color: #f1f5f9;
          color: #475569;
        }
        
        .status-sent {
          background-color: #eff6ff;
          color: #3b82f6;
        }
        
        .status-paid {
          background-color: #ecfdf5;
          color: #10b981;
        }
        
        .status-cancelled {
          background-color: #fef2f2;
          color: #ef4444;
        }
        
        .print-actions {
          text-align: center;
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: opacity 0.2s;
          text-decoration: none;
        }
        
        .btn:hover {
          opacity: 0.9;
        }
        
        .btn-secondary {
          background-color: var(--muted-color);
        }
        
        /* Print styles */
        @media print {
          body { 
            background-color: white;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-container {
            box-shadow: none;
            max-width: 100%;
            padding: 0;
          }
          .print-actions {
            display: none !important;
          }
        }
      </style>
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
      </script>
    </body>
    </html>
  `;
};

/**
 * Generates HTML for the status badge
 */
function getStatusBadge(status: string): string {
  const statusLabels: Record<string, string> = {
    'draft': 'Borrador',
    'sent': 'Enviada',
    'paid': 'Pagada',
    'cancelled': 'Cancelada'
  };
  
  return `<span class="status-badge status-${status}">${statusLabels[status] || status}</span>`;
}
