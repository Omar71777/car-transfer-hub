
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { Filters, ProfitStats, ProfitsData } from './types';
import { calculateCommission, calculateStats, generateChartData, generateMonthlyData } from './useCalculations';
import { applyFilters } from './useFilters';

export function useProfitsData(): ProfitsData {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  const [uniqueCollaborators, setUniqueCollaborators] = useState<string[]>([]);
  const [uniqueExpenseTypes, setUniqueExpenseTypes] = useState<string[]>([]);

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

  useEffect(() => {
    const loadProfitsData = () => {
      setLoading(true);
      
      // Load transfers from localStorage
      const storedTransfers = localStorage.getItem('transfers');
      const dummyTransfers = [
        {
          id: '1',
          date: '2025-04-09',
          time: '09:30',
          origin: 'Aeropuerto de Ibiza',
          destination: 'Hotel Ushuaïa',
          price: 85,
          collaborator: 'Carlos Sánchez',
          commission: 10,
          expenses: []
        },
        {
          id: '2',
          date: '2025-04-09',
          time: '14:45',
          origin: 'Hotel Pacha',
          destination: 'Playa d\'en Bossa',
          price: 65,
          collaborator: 'María López',
          commission: 15,
          expenses: []
        }
      ];
      const loadedTransfers = storedTransfers ? JSON.parse(storedTransfers) : dummyTransfers;
      setTransfers(loadedTransfers);
      setFilteredTransfers(loadedTransfers);

      // Extract unique collaborators
      const collaborators = [...new Set(loadedTransfers.map((t: Transfer) => t.collaborator))];
      setUniqueCollaborators(collaborators as string[]);

      // Load expenses from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      const dummyExpenses = [
        {
          id: '1',
          transferId: '1',
          date: '2025-04-09',
          concept: 'Combustible',
          amount: 45.50
        },
        {
          id: '2',
          transferId: '2',
          date: '2025-04-09',
          concept: 'Peaje',
          amount: 12.30
        }
      ];
      const loadedExpenses = storedExpenses ? JSON.parse(storedExpenses) : dummyExpenses;
      setExpenses(loadedExpenses);
      setFilteredExpenses(loadedExpenses);

      // Extract unique expense types
      const expenseTypes = [...new Set(loadedExpenses.map((e: Expense) => e.concept))];
      setUniqueExpenseTypes(expenseTypes as string[]);
      
      setLoading(false);
    };

    loadProfitsData();
  }, []);

  // Update stats and charts whenever filtered data changes
  useEffect(() => {
    if (filteredTransfers.length > 0) {
      // Calculate stats
      const newStats = calculateStats(filteredTransfers, filteredExpenses);
      setStats(newStats);

      // Generate chart data
      setChartData(generateChartData(newStats));

      // Generate monthly data
      setMonthlyData(generateMonthlyData());
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

// Re-export the types for easier imports
export * from './types';
