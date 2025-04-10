
import { Transfer, Expense } from '@/types';
import { ProfitStats } from './types';
import { format, parseISO, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale';

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
  
  const netProfit = totalIncome - totalExpenses - totalCommissions;
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

// Generate monthly data from transfers and expenses
export const generateMonthlyData = (transfers: Transfer[], expenses: Expense[]): any[] => {
  // Create a map to store data by month-year
  const monthlyDataMap: Record<string, {
    name: string;
    ingresos: number;
    gastos: number;
    comisiones: number;
    beneficio: number;
    date: Date;
  }> = {};

  // Process transfers
  transfers.forEach(transfer => {
    const transferDate = parseISO(transfer.date);
    const month = getMonth(transferDate);
    const year = getYear(transferDate);
    const monthYearKey = `${month}-${year}`;
    
    // Format the month name in Spanish
    const monthName = format(transferDate, 'MMM', { locale: es });
    
    if (!monthlyDataMap[monthYearKey]) {
      monthlyDataMap[monthYearKey] = {
        name: monthName,
        ingresos: 0,
        gastos: 0,
        comisiones: 0,
        beneficio: 0,
        date: transferDate
      };
    }
    
    // Add transfer price to income
    monthlyDataMap[monthYearKey].ingresos += transfer.price;
    
    // Calculate and add commission
    const commission = calculateCommission(transfer);
    monthlyDataMap[monthYearKey].comisiones += commission;
  });
  
  // Process expenses
  expenses.forEach(expense => {
    const expenseDate = parseISO(expense.date);
    const month = getMonth(expenseDate);
    const year = getYear(expenseDate);
    const monthYearKey = `${month}-${year}`;
    
    // Skip if there's no matching month (no transfers in this month)
    if (!monthlyDataMap[monthYearKey]) return;
    
    // Add expense amount
    monthlyDataMap[monthYearKey].gastos += expense.amount;
  });
  
  // Calculate profits and convert to array
  const monthlyData = Object.values(monthlyDataMap).map(data => {
    data.beneficio = data.ingresos - data.gastos - data.comisiones;
    return data;
  });
  
  // Sort by date
  monthlyData.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return monthlyData;
};
