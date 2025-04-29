
/**
 * Print utilities for report generation - Using the unified print service
 */
import { Transfer, Expense } from '@/types';
import { prepareProfitDataForExport } from './profitExport';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { printHtmlContent } from '@/lib/print/printService';

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
  
  // Get current month and year in Spanish
  const currentMonth = format(new Date(), 'MMMM yyyy', { locale: es });
  
  // Create the HTML content
  const htmlContent = `
    <div class="profit-report">
      ${userData ? `<div class="card">
        <p>Usuario: ${userData.name || userData.email}</p>
        <p>Periodo: ${currentMonth}</p>
      </div>` : ''}
      
      <div class="card">
        <h3 class="card-title">Resumen</h3>
        <table>
          <tr>
            <th>Ingresos Totales</th>
            <th>Gastos Totales</th>
            <th>Comisiones</th>
            <th>Beneficio Neto</th>
            <th>Margen de Beneficio</th>
          </tr>
          <tr class="summary">
            <td class="text-right">${stats.totalIncome.toFixed(2)}€</td>
            <td class="text-right">${stats.totalExpenses.toFixed(2)}€</td>
            <td class="text-right">${stats.totalCommissions.toFixed(2)}€</td>
            <td class="text-right">${stats.netProfit.toFixed(2)}€</td>
            <td class="text-right">${stats.profitMargin.toFixed(2)}%</td>
          </tr>
        </table>
      </div>
      
      <div class="card">
        <h3 class="card-title">Listado de Transfers</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Origen</th>
              <th>Destino</th>
              <th class="text-right">Precio (€)</th>
              <th>Colaborador</th>
              <th class="text-right">Comisión (%)</th>
              <th class="text-right">Importe Comisión (€)</th>
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
                  <td class="text-right">${transfer.price.toFixed(2)}€</td>
                  <td>${transfer.collaborator || 'N/A'}</td>
                  <td class="text-right">${transfer.commission}%</td>
                  <td class="text-right">${commissionAmount.toFixed(2)}€</td>
                  <td>
                    <span class="${transfer.paymentStatus === 'paid' ? 'status-badge status-paid' : 'status-badge status-pending'}">
                      ${transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr class="font-bold">
              <td colspan="4" class="text-right">Totales:</td>
              <td class="text-right">${transfers.reduce((sum, t) => sum + t.price, 0).toFixed(2)}€</td>
              <td colspan="1"></td>
              <td class="text-right"></td>
              <td class="text-right">${transfers.reduce((sum, t) => sum + (t.price * t.commission / 100), 0).toFixed(2)}€</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
  
  // Use our new print service
  printHtmlContent(
    htmlContent,
    title,
    {
      fileName: `informe_ganancias_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
      showPdfExport: true,
      orientation: 'landscape'
    }
  );
}
