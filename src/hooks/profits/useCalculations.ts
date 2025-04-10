
import { Transfer, Expense } from '@/types';
import { ProfitStats } from './types';

// Calculate commission for a transfer
export const calculateCommission = (transfer: Transfer): number => {
  return (transfer.price * transfer.commission) / 100;
};

// Calculate statistics based on transfers and expenses
export const calculateStats = (transfers: Transfer[], expenses: Expense[]): ProfitStats => {
  const totalIncome = transfers.reduce((sum: number, transfer: Transfer) => 
    sum + (transfer.price || 0), 0);
  
  const totalCommissions = transfers.reduce((sum: number, transfer: Transfer) => 
    sum + calculateCommission(transfer), 0);
  
  const totalExpenses = expenses.reduce((sum: number, expense: Expense) => 
    sum + (expense.amount || 0), 0);
  
  const netProfit = totalIncome - (totalExpenses + totalCommissions);
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  
  return {
    totalIncome,
    totalExpenses,
    totalCommissions,
    netProfit,
    profitMargin
  };
};

// Generate chart data based on stats
export const generateChartData = (stats: ProfitStats): any[] => {
  return [
    { name: 'Ingresos', value: stats.totalIncome, fill: '#3b82f6' },
    { name: 'Gastos', value: stats.totalExpenses, fill: '#ef4444' },
    { name: 'Comisiones', value: stats.totalCommissions, fill: '#f59e0b' },
    { name: 'Beneficio Neto', value: stats.netProfit, fill: '#10b981' }
  ];
};

// Generate example monthly data
export const generateMonthlyData = (): any[] => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  return months.map(month => ({
    name: month,
    ingresos: Math.floor(Math.random() * 5000) + 3000,
    gastos: Math.floor(Math.random() * 1500) + 800,
    comisiones: Math.floor(Math.random() * 500) + 200,
    beneficio: Math.floor(Math.random() * 3000) + 2000,
  }));
};
