
import { Transfer } from '@/types';
import { Expense } from '@/types';
import { downloadCSVFromData, printProfitReport } from '@/lib/exports';

export function generateExportData(transfers: Transfer[]) {
  return transfers.map(transfer => ({
    Fecha: transfer.date,
    Hora: transfer.time || 'N/A',
    Origen: transfer.origin,
    Destino: transfer.destination,
    Precio: transfer.price,
    Cliente: transfer.client?.name || 'N/A',
    Colaborador: transfer.collaborator || 'N/A',
    Comisión: transfer.commission + '%',
    'Importe Comisión': (transfer.price * transfer.commission / 100).toFixed(2) + '€'
  }));
}

export function handleExportCSV(transfers: Transfer[]) {
  const data = generateExportData(transfers);
  downloadCSVFromData(data, 'transfers-report.csv');
}

export function generateReportStats(transfers: Transfer[], expenses: Expense[]) {
  // Calculate total income from transfers
  const totalIncome = transfers.reduce((sum, t) => sum + t.price, 0);

  // Correctly calculate total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate commissions
  const totalCommissions = transfers.reduce((sum, t) => {
    return sum + (t.commissionType === 'percentage' 
      ? (t.price * t.commission / 100) 
      : t.commission);
  }, 0);

  // Calculate net profit: income - expenses - commissions
  const netProfit = totalIncome - totalExpenses - totalCommissions;

  // Calculate profit margin
  const profitMargin = totalIncome > 0 ? netProfit / totalIncome * 100 : 0;
  
  return {
    totalIncome,
    totalExpenses,
    totalCommissions,
    netProfit,
    profitMargin
  };
}
