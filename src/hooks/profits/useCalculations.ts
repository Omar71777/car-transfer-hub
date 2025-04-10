import { Transfer, Expense } from '@/types';
import { ProfitStats } from './types';
import { format, parse, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';

// Calculate commission based on commission type
export const calculateCommission = (transfer: Transfer): number => {
  return calculateCommissionAmount(transfer);
};

// Calculate main stats from transfers and expenses
export const calculateStats = (transfers: Transfer[], expenses: Expense[]): ProfitStats => {
  const totalIncome = transfers.reduce((sum, transfer) => sum + calculateTotalPrice(transfer), 0);
  
  // Sum commissions based on type
  const totalCommissions = transfers.reduce((sum, transfer) => {
    return sum + calculateCommissionAmount(transfer);
  }, 0);
  
  const regularExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = regularExpenses + totalCommissions;
  
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  
  return {
    totalIncome,
    totalExpenses,
    totalCommissions,
    netProfit,
    profitMargin
  };
};

// Generate chart data for income vs expenses
export const generateChartData = (stats: ProfitStats) => {
  return [
    {
      name: 'Ingresos',
      value: stats.totalIncome
    },
    {
      name: 'Comisiones',
      value: stats.totalCommissions
    },
    {
      name: 'Otros Gastos',
      value: stats.totalExpenses - stats.totalCommissions
    },
    {
      name: 'Beneficio Neto',
      value: stats.netProfit
    }
  ];
};

// Generate monthly data for income and expenses
export const generateMonthlyData = (transfers: Transfer[], expenses: Expense[]) => {
  const monthlyData: Record<string, {
    month: string;
    income: number;
    expenses: number;
    commissions: number;
    profit: number;
  }> = {};
  
  // Process transfers by month
  transfers.forEach(transfer => {
    try {
      const date = parseISO(transfer.date);
      if (!isValid(date)) return;
      
      const monthYearKey = format(date, 'yyyy-MM');
      const monthYearLabel = format(date, 'MMMM yyyy', { locale: es });
      
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = {
          month: monthYearLabel,
          income: 0,
          expenses: 0,
          commissions: 0,
          profit: 0
        };
      }
      
      // Use the correct total price calculation
      monthlyData[monthYearKey].income += calculateTotalPrice(transfer);
      monthlyData[monthYearKey].commissions += calculateCommissionAmount(transfer);
    } catch (error) {
      console.error('Error processing transfer date:', error);
    }
  });
  
  // Process expenses by month
  expenses.forEach(expense => {
    try {
      const date = parseISO(expense.date);
      if (!isValid(date)) return;
      
      const monthYearKey = format(date, 'yyyy-MM');
      
      if (monthlyData[monthYearKey]) {
        monthlyData[monthYearKey].expenses += expense.amount;
      }
    } catch (error) {
      console.error('Error processing expense date:', error);
    }
  });
  
  // Calculate profit for each month
  Object.values(monthlyData).forEach(month => {
    month.profit = month.income - month.expenses - month.commissions;
  });
  
  return Object.values(monthlyData).sort((a, b) => {
    const monthA = parse(a.month, 'MMMM yyyy', new Date(), { locale: es });
    const monthB = parse(b.month, 'MMMM yyyy', new Date(), { locale: es });
    return monthB.getTime() - monthA.getTime();
  });
};
