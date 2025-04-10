
/**
 * Profit data export utilities
 */
import { Transfer, Expense } from '@/types';

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
  
  // Calculate profit for each date: income - (expenses + commissions)
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
    totalExpenses: stats.totalExpenses.toFixed(2),
    totalCommissions: stats.totalCommissions.toFixed(2),
    netProfit: stats.netProfit.toFixed(2),
    profitMargin: `${stats.profitMargin.toFixed(2)}%`
  }];
  
  return {
    dailyData,
    summaryData
  };
}
