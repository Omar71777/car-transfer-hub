
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
          .select('id, price, commission')
          .order('date', { ascending: false });
          
        if (transfersError) throw transfersError;
        
        // Load expenses from Supabase
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .order('date', { ascending: false });
          
        if (expensesError) throw expensesError;
        
        // Calculate total commissions (assume all are percentage-based since we don't have commission_type)
        const totalCommissions = transfers.reduce((sum, transfer) => {
          // Default to percentage-based commission calculation
          const commissionAmount = (Number(transfer.price) * Number(transfer.commission)) / 100 || 0;
          return sum + commissionAmount;
        }, 0);
        
        // Add regular expenses and commissions
        const expensesTotal = expenses.reduce((sum, expense) => 
          sum + (Number(expense.amount) || 0), 0);
        const totalExpenses = expensesTotal + totalCommissions;
        
        // Calculate stats
        setStats({
          totalTransfers: transfers.length,
          totalIncome: transfers.reduce((sum, transfer) => 
            sum + (Number(transfer.price) || 0), 0),
          totalExpenses: totalExpenses,
          netIncome: transfers.reduce((sum, transfer) => 
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
