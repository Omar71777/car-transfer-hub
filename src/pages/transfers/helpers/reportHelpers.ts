
import { Transfer } from '@/types';
import { Expense } from '@/types';
import { downloadCSVFromData, printProfitReport } from '@/lib/exports';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';

export function generateExportData(transfers: Transfer[]) {
  return transfers.map(transfer => {
    const totalPrice = calculateTotalPrice(transfer);
    const commission = calculateCommissionAmount(transfer);
    const commissionPercentage = totalPrice > 0 ? ((commission / totalPrice) * 100).toFixed(2) : '0';
    
    return {
      Fecha: transfer.date,
      Hora: transfer.time || 'N/A',
      Origen: transfer.origin,
      Destino: transfer.destination,
      Precio: totalPrice.toFixed(2) + '€',
      Cliente: transfer.client?.name || 'N/A',
      Colaborador: transfer.collaborator || 'N/A',
      Comisión: transfer.commissionType === 'percentage' ? transfer.commission + '%' : commissionPercentage + '%',
      'Importe Comisión': commission.toFixed(2) + '€'
    };
  });
}

export function handleExportCSV(transfers: Transfer[]) {
  const data = generateExportData(transfers);
  downloadCSVFromData(data, 'transfers-report.csv');
}

export function generateReportStats(transfers: Transfer[], expenses: Expense[]) {
  // Calculate total income from transfers with the correct price calculation
  const totalIncome = transfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);

  // Correctly calculate total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate commissions with the correct method
  const totalCommissions = transfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);

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
