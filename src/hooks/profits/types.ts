
import { Transfer, Expense } from '@/types';

export interface ProfitStats {
  totalIncome: number;
  totalExpenses: number;
  totalCommissions: number;
  netProfit: number;
  profitMargin: number;
}

export interface Filters {
  dateRange?: { from?: Date; to?: Date };
  collaborator?: string;
  expenseType?: string;
}

export interface ProfitsData {
  transfers: Transfer[];
  expenses: Expense[];
  allTransfers: Transfer[];
  allExpenses: Expense[];
  stats: ProfitStats;
  chartData: any[];
  monthlyData: any[];
  loading: boolean;
  calculateCommission: (transfer: Transfer) => number;
  filters: Filters;
  updateFilters: (newFilters: Filters) => void;
  resetFilters: () => void;
  uniqueCollaborators: string[];
  uniqueExpenseTypes: string[];
}
