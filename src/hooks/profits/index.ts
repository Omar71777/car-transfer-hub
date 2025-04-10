
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { Filters, ProfitStats, ProfitsData } from './types';
import { calculateCommission, calculateStats, generateChartData, generateMonthlyData } from './useCalculations';
import { applyFilters } from './useFilters';
import { useDataLoader } from './useDataLoader';

export function useProfitsData(): ProfitsData {
  const { 
    transfers, 
    expenses, 
    loading, 
    uniqueCollaborators,
    uniqueExpenseTypes 
  } = useDataLoader();
  
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ProfitStats>({
    totalIncome: 0,
    totalExpenses: 0,
    totalCommissions: 0,
    netProfit: 0,
    profitMargin: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({});

  // Initialize filtered data when transfers and expenses are loaded
  useEffect(() => {
    setFilteredTransfers(transfers);
    setFilteredExpenses(expenses);
  }, [transfers, expenses]);

  // Apply filters to transfers and expenses
  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    const { filteredTransfers: newFilteredTransfers, filteredExpenses: newFilteredExpenses } = 
      applyFilters(transfers, expenses, newFilters);
    setFilteredTransfers(newFilteredTransfers);
    setFilteredExpenses(newFilteredExpenses);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setFilteredTransfers(transfers);
    setFilteredExpenses(expenses);
  };

  // Update stats and charts whenever filtered data changes
  useEffect(() => {
    if (filteredTransfers.length > 0 || filteredExpenses.length > 0) {
      // Calculate stats
      const newStats = calculateStats(filteredTransfers, filteredExpenses);
      setStats(newStats);

      // Generate chart data
      setChartData(generateChartData(newStats));

      // Generate monthly data
      setMonthlyData(generateMonthlyData(filteredTransfers, filteredExpenses));
    }
  }, [filteredTransfers, filteredExpenses]);

  return {
    transfers: filteredTransfers,
    expenses: filteredExpenses,
    allTransfers: transfers,
    allExpenses: expenses,
    stats,
    chartData,
    monthlyData,
    loading,
    calculateCommission,
    filters,
    updateFilters,
    resetFilters,
    uniqueCollaborators,
    uniqueExpenseTypes
  };
}

// Re-export the types and utility functions for easier imports
export * from './types';
export { calculateCommission } from './useCalculations';
