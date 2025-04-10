
/**
 * Print utilities for report generation
 */
import { Transfer, Expense } from '@/types';
import { prepareProfitDataForExport } from './profitExport';

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
  }
): void {
  const { dailyData, summaryData } = prepareProfitDataForExport(transfers, expenses, stats);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this website to print reports');
    return;
  }
  
  // Generate report HTML
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f2f2f2; padding: 10px; text-align: left; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          .summary { font-weight: bold; background-color: #f9f9f9; }
          .date { min-width: 100px; }
          .amount { text-align: right; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
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
        
        <h2>Detalle Diario</h2>
        <table>
          <tr>
            <th class="date">Fecha</th>
            <th>Ingresos</th>
            <th>Gastos</th>
            <th>Comisiones</th>
            <th>Beneficio</th>
          </tr>
          ${dailyData.map(day => `
            <tr>
              <td>${day.date}</td>
              <td class="amount">${day.income.toFixed(2)}€</td>
              <td class="amount">${day.expenses.toFixed(2)}€</td>
              <td class="amount">${day.commissions.toFixed(2)}€</td>
              <td class="amount">${day.profit.toFixed(2)}€</td>
            </tr>
          `).join('')}
        </table>
        <button onclick="window.print();" style="margin-top: 20px; padding: 10px 20px;">
          Imprimir Informe
        </button>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}
