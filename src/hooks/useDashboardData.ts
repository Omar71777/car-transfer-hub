
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  totalTransfers: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTransfers: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        // Load transfers from Supabase
        const { data: transfers, error: transfersError } = await supabase
          .from('transfers')
          .select('id, price, commission, commission_type')
          .order('date', { ascending: false });
          
        if (transfersError) throw transfersError;
        
        // Load expenses from Supabase
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .order('date', { ascending: false });
          
        if (expensesError) throw expensesError;
        
        // Calculate total commissions considering commission type
        const totalCommissions = transfers.reduce((sum: number, transfer: any) => {
          // Check commission type and calculate accordingly
          const commissionAmount = transfer.commission_type === 'percentage'
            ? ((Number(transfer.price) * Number(transfer.commission)) / 100 || 0)
            : (Number(transfer.commission) || 0);
          return sum + commissionAmount;
        }, 0);
        
        // Add regular expenses and commissions
        const expensesTotal = expenses.reduce((sum: number, expense: Expense) => 
          sum + (Number(expense.amount) || 0), 0);
        const totalExpenses = expensesTotal + totalCommissions;
        
        // Calculate stats
        setStats({
          totalTransfers: transfers.length,
          totalIncome: transfers.reduce((sum: number, transfer: Transfer) => 
            sum + (Number(transfer.price) || 0), 0),
          totalExpenses: totalExpenses,
          netIncome: transfers.reduce((sum: number, transfer: Transfer) => 
            sum + (Number(transfer.price) || 0), 0) - totalExpenses
        });
      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast.error(`Error al cargar los datos del dashboard: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return {
    stats,
    loading
  };
}
