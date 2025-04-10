import { Transfer, Expense, Shift, Driver } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Convert data to CSV format
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => {
    return Object.values(item).map(value => {
      // Handle values that contain commas by wrapping them in quotes
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');
  });
  
  return `${headers}\n${rows.join('\n')}`;
}

// Trigger CSV download
export function downloadCSV(data: any[], filename: string): void {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Prepare profit data in a format suitable for export
export function prepareProfitDataForExport(
  transfers: Transfer[],
  expenses: Expense[],
  stats: { 
    totalIncome: number;
    totalExpenses: number;
    totalCommissions: number;
    netProfit: number;
    profitMargin: number;
  }
) {
  // Daily profit data
  const profitsByDate: Record<string, { 
    date: string;
    income: number;
    expenses: number;
    commissions: number;
    profit: number;
  }> = {};
  
  // Group transfers by date
  transfers.forEach(transfer => {
    const date = transfer.date;
    if (!profitsByDate[date]) {
      profitsByDate[date] = {
        date,
        income: 0,
        expenses: 0,
        commissions: 0,
        profit: 0
      };
    }
    profitsByDate[date].income += transfer.price;
    const commission = (transfer.price * transfer.commission) / 100;
    profitsByDate[date].commissions += commission;
  });
  
  // Add expenses by date
  expenses.forEach(expense => {
    const date = expense.date;
    if (!profitsByDate[date]) {
      profitsByDate[date] = {
        date,
        income: 0,
        expenses: 0,
        commissions: 0,
        profit: 0
      };
    }
    profitsByDate[date].expenses += expense.amount;
  });
  
  // Calculate profit for each date
  Object.values(profitsByDate).forEach(dayData => {
    dayData.profit = dayData.income - (dayData.expenses + dayData.commissions);
  });
  
  // Convert to array and sort by date
  const dailyData = Object.values(profitsByDate).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Summary data (one row)
  const summaryData = [{
    type: 'Summary',
    totalIncome: stats.totalIncome.toFixed(2),
    totalExpenses: (stats.totalExpenses - stats.totalCommissions).toFixed(2),
    totalCommissions: stats.totalCommissions.toFixed(2),
    netProfit: stats.netProfit.toFixed(2),
    profitMargin: `${stats.profitMargin.toFixed(2)}%`
  }];
  
  return {
    dailyData,
    summaryData
  };
}

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
            <td class="amount">${(stats.totalExpenses - stats.totalCommissions).toFixed(2)}€</td>
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

// Prepare shifts data for export
export function prepareShiftsForExport(
  shifts: Shift[],
  drivers: Driver[],
  startDate: Date,
  endDate: Date
): any[] {
  // Skip if no shifts
  if (shifts.length === 0) return [];
  
  // Create a map of driver IDs to names for quick lookup
  const driverMap = drivers.reduce((map, driver) => {
    map[driver.id] = driver.name;
    return map;
  }, {} as Record<string, string>);
  
  // Filter shifts within date range
  const filteredShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startDate && shiftDate <= endDate;
  });
  
  // Transform shifts to export format
  return filteredShifts.map(shift => ({
    Fecha: shift.date,
    Conductor: driverMap[shift.driverId] || 'Desconocido',
    TipoTurno: shift.isFullDay ? 'Completo (24h)' : 'Medio (12h)',
    ID: shift.id
  }));
}
