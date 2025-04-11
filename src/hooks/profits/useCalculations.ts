
import { Transfer, Expense } from '@/types';
import { ProfitStats } from './types';
import { format, parse, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  calculateTotalPrice, 
  calculateCommissionAmount,
  calculateBasePrice,
  calculateExtraChargesTotal,
  calculateDiscountAmount
} from '@/lib/calculations';

// Calculate commission based on commission type
export const calculateCommission = (transfer: Transfer): number => {
  return calculateCommissionAmount(transfer);
};

// Calculate main stats from transfers and expenses
export const calculateStats = (transfers: Transfer[], expenses: Expense[]): ProfitStats => {
  // Calculate total income using the shared calculation function
  const totalIncome = transfers.reduce((sum, transfer) => sum + calculateTotalPrice(transfer), 0);
  
  // Sum commissions using the shared calculation function
  const totalCommissions = transfers.reduce((sum, transfer) => 
    sum + calculateCommissionAmount(transfer), 0);
  
  // Sum all regular expenses (not including commissions)
  const regularExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Total expenses is ONLY regular expenses (commissions are displayed separately)
  const totalExpenses = regularExpenses;
  
  // Net profit is income minus total expenses and commissions
  const netProfit = totalIncome - totalExpenses - totalCommissions;
  
  // Profit margin as a percentage (avoid division by zero)
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  
  console.log('Profit stats calculation:', {
    totalIncome,
    totalExpenses,
    totalCommissions,
    regularExpenses,
    netProfit,
    profitMargin,
    // Log detailed for a sample transfer if available
    sampleTransfer: transfers.length > 0 ? {
      id: transfers[0].id,
      serviceType: transfers[0].serviceType,
      price: transfers[0].price,
      hours: transfers[0].hours,
      basePrice: calculateBasePrice(transfers[0]),
      extraCharges: calculateExtraChargesTotal(transfers[0].extraCharges),
      discount: calculateDiscountAmount(transfers[0]),
      totalPrice: calculateTotalPrice(transfers[0]),
      commission: calculateCommissionAmount(transfers[0])
    } : 'No transfers'
  });
  
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
      value: stats.totalIncome,
      fill: '#3b82f6'
    },
    {
      name: 'Comisiones',
      value: stats.totalCommissions,
      fill: '#f59e0b'
    },
    {
      name: 'Otros Gastos',
      value: stats.totalExpenses,
      fill: '#ef4444'
    },
    {
      name: 'Beneficio Neto',
      value: stats.netProfit,
      fill: '#10b981'
    }
  ];
};

// Generate monthly data for income and expenses
export const generateMonthlyData = (transfers: Transfer[], expenses: Expense[]) => {
  const monthlyData: Record<string, {
    name: string;
    ingresos: number;
    gastos: number;
    comisiones: number;
    beneficio: number;
  }> = {};
  
  // Process transfers by month
  transfers.forEach(transfer => {
    try {
      const date = parseISO(transfer.date);
      if (!isValid(date)) return;
      
      const monthYearKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMMM', { locale: es });
      const monthNameCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = {
          name: monthNameCapitalized,
          ingresos: 0,
          gastos: 0,
          comisiones: 0,
          beneficio: 0
        };
      }
      
      // Use the correct total price calculation
      monthlyData[monthYearKey].ingresos += calculateTotalPrice(transfer);
      monthlyData[monthYearKey].comisiones += calculateCommissionAmount(transfer);
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
        monthlyData[monthYearKey].gastos += expense.amount;
      }
    } catch (error) {
      console.error('Error processing expense date:', error);
    }
  });
  
  // Calculate profit for each month
  Object.values(monthlyData).forEach(month => {
    month.beneficio = month.ingresos - (month.gastos + month.comisiones);
  });
  
  // Sort by date
  return Object.entries(monthlyData)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([_, data]) => data);
};
