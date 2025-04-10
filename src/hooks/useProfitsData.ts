
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { isWithinInterval, parseISO, isValid } from 'date-fns';

interface ProfitStats {
  totalIncome: number;
  totalExpenses: number;
  totalCommissions: number;
  netProfit: number;
  profitMargin: number;
}

interface Filters {
  dateRange?: { from?: Date; to?: Date };
  collaborator?: string;
  expenseType?: string;
}

export function useProfitsData() {
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

  // Calculate commission for a transfer
  const calculateCommission = (transfer: Transfer) => {
    return (transfer.price * transfer.commission) / 100;
  };

  // Apply filters to transfers and expenses
  const applyFilters = (currentFilters: Filters) => {
    let filteredT = [...transfers];
    let filteredE = [...expenses];

    // Filter by date range
    if (currentFilters.dateRange?.from && currentFilters.dateRange?.to) {
      filteredT = filteredT.filter(transfer => {
        const transferDate = parseISO(transfer.date);
        return isValid(transferDate) && isWithinInterval(transferDate, {
          start: currentFilters.dateRange!.from!,
          end: currentFilters.dateRange!.to!
        });
      });

      filteredE = filteredE.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isValid(expenseDate) && isWithinInterval(expenseDate, {
          start: currentFilters.dateRange!.from!,
          end: currentFilters.dateRange!.to!
        });
      });
    }

    // Filter by collaborator
    if (currentFilters.collaborator) {
      filteredT = filteredT.filter(transfer => 
        transfer.collaborator === currentFilters.collaborator
      );
      
      // Get transfer IDs from filtered transfers to filter expenses
      const transferIds = filteredT.map(t => t.id);
      filteredE = filteredE.filter(expense => transferIds.includes(expense.transferId));
    }

    // Filter by expense type
    if (currentFilters.expenseType) {
      filteredE = filteredE.filter(expense => 
        expense.concept === currentFilters.expenseType
      );
      
      // Keep only transfers that have expenses of the selected type
      const transferIdsWithExpenseType = filteredE.map(e => e.transferId);
      if (transferIdsWithExpenseType.length > 0) {
        filteredT = filteredT.filter(transfer => 
          transferIdsWithExpenseType.includes(transfer.id)
        );
      }
    }

    setFilteredTransfers(filteredT);
    setFilteredExpenses(filteredE);
  };

  // Update filters and apply them
  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
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
      const totalIncome = filteredTransfers.reduce((sum: number, transfer: Transfer) => 
        sum + (transfer.price || 0), 0);
      
      const totalCommissions = filteredTransfers.reduce((sum: number, transfer: Transfer) => 
        sum + calculateCommission(transfer), 0);
      
      const expensesTotal = filteredExpenses.reduce((sum: number, expense: Expense) => 
        sum + (expense.amount || 0), 0);
      
      const totalExpenses = expensesTotal + totalCommissions;
      
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
      
      setStats({
        totalIncome,
        totalExpenses,
        totalCommissions,
        netProfit,
        profitMargin
      });

      // Generate chart data
      const chartData = [
        { name: 'Ingresos', value: totalIncome, fill: '#3b82f6' },
        { name: 'Gastos', value: expensesTotal, fill: '#ef4444' },
        { name: 'Comisiones', value: totalCommissions, fill: '#f59e0b' },
        { name: 'Beneficio Neto', value: netProfit, fill: '#10b981' }
      ];
      setChartData(chartData);

      // Generate monthly data (example data - in a real app this would be calculated from actual transfers)
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      const monthlyData = months.map(month => ({
        name: month,
        ingresos: Math.floor(Math.random() * 5000) + 3000,
        gastos: Math.floor(Math.random() * 1500) + 800,
        comisiones: Math.floor(Math.random() * 500) + 200,
        beneficio: Math.floor(Math.random() * 3000) + 2000,
      }));
      setMonthlyData(monthlyData);
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
