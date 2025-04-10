
/**
 * Print utilities for report generation
 */
import { Transfer, Expense } from '@/types';
import { prepareProfitDataForExport } from './profitExport';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

// Print function
export function printProfitReport(
  title: string, 
  transfers: Transfer[],
  expenses: Expense[],
  stats: { 
    totalIncome: number;
    totalExpenses: number;
    totalCommissions: number;
    netProfit: number;
    profitMargin: number;
  },
  userData?: { 
    name: string;
    email: string;
  }
): void {
  const { summaryData } = prepareProfitDataForExport(transfers, expenses, stats);
  
  // Get current month and year - now in Spanish
  const currentMonth = format(new Date(), 'MMMM yyyy', { locale: es });
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this website to print reports');
    return;
  }
  
  // Generate report HTML - now with full transfers table
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; text-align: center; }
          h2 { color: #555; }
          .user-info { margin-bottom: 15px; color: #666; }
          .month-info { margin-bottom: 20px; font-weight: bold; color: #555; font-size: 1.1em; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f2f2f2; padding: 10px; text-align: left; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          .summary { font-weight: bold; background-color: #f9f9f9; }
          .date { min-width: 100px; }
          .amount { text-align: right; }
          .status-paid { color: #22c55e; }
          .status-pending { color: #f97316; }
          .footer-row { font-weight: bold; background-color: #f9f9f9; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        
        ${userData ? `<div class="user-info">Usuario: ${userData.name || userData.email}</div>` : ''}
        <div class="month-info">Periodo: ${currentMonth}</div>
        
        <h2>Resumen</h2>
        <table>
          <tr>
            <th>Ingresos Totales</th>
            <th>Gastos Totales</th>
            <th>Comisiones</th>
            <th>Beneficio Neto</th>
            <th>Margen de Beneficio</th>
          </tr>
          <tr class="summary">
            <td class="amount">${stats.totalIncome.toFixed(2)}€</td>
            <td class="amount">${stats.totalExpenses.toFixed(2)}€</td>
            <td class="amount">${stats.totalCommissions.toFixed(2)}€</td>
            <td class="amount">${stats.netProfit.toFixed(2)}€</td>
            <td class="amount">${stats.profitMargin.toFixed(2)}%</td>
          </tr>
        </table>
        
        <h2>Listado de Transfers</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Origen</th>
              <th>Destino</th>
              <th class="amount">Precio (€)</th>
              <th>Colaborador</th>
              <th class="amount">Comisión (%)</th>
              <th class="amount">Importe Comisión (€)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${transfers.map(transfer => {
              const commissionAmount = transfer.price * transfer.commission / 100;
              return `
                <tr>
                  <td>${transfer.date}</td>
                  <td>${transfer.time || 'N/A'}</td>
                  <td>${transfer.origin}</td>
                  <td>${transfer.destination}</td>
                  <td class="amount">${transfer.price.toFixed(2)}€</td>
                  <td>${transfer.collaborator || 'N/A'}</td>
                  <td class="amount">${transfer.commission}%</td>
                  <td class="amount">${commissionAmount.toFixed(2)}€</td>
                  <td class="${transfer.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}">
                    ${transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr class="footer-row">
              <td colspan="4" class="text-right">Totales:</td>
              <td class="amount">${transfers.reduce((sum, t) => sum + t.price, 0).toFixed(2)}€</td>
              <td colspan="1"></td>
              <td class="amount"></td>
              <td class="amount">${transfers.reduce((sum, t) => sum + (t.price * t.commission / 100), 0).toFixed(2)}€</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        
        <button onclick="window.print();" style="margin-top: 20px; padding: 10px 20px;">
          Imprimir Informe
        </button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}

