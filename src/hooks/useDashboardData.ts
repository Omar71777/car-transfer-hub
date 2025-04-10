
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '@/lib/utils';

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
          .select('id, price, commission, origin, destination, collaborator')
          .order('date', { ascending: false });
          
        if (transfersError) throw transfersError;
        
        // Capitalize text fields
        const capitalizedTransfers = transfers.map(transfer => ({
          ...transfer,
          origin: capitalizeFirstLetter(transfer.origin),
          destination: capitalizeFirstLetter(transfer.destination),
          collaborator: capitalizeFirstLetter(transfer.collaborator),
        }));
        
        // Load expenses from Supabase
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount, concept')
          .order('date', { ascending: false });
          
        if (expensesError) throw expensesError;
        
        // Capitalize expense descriptions (using concept field instead of description)
        const capitalizedExpenses = expenses.map(expense => ({
          ...expense,
          concept: capitalizeFirstLetter(expense.concept),
        }));
        
        // Calculate total commissions (assume all are percentage-based since we don't have commission_type)
        const totalCommissions = capitalizedTransfers.reduce((sum, transfer) => {
          // Default to percentage-based commission calculation
          const commissionAmount = (Number(transfer.price) * Number(transfer.commission)) / 100 || 0;
          return sum + commissionAmount;
        }, 0);
        
        // Add regular expenses and commissions
        const expensesTotal = capitalizedExpenses.reduce((sum, expense) => 
          sum + (Number(expense.amount) || 0), 0);
        const totalExpenses = expensesTotal + totalCommissions;
        
        // Calculate stats
        setStats({
          totalTransfers: capitalizedTransfers.length,
          totalIncome: capitalizedTransfers.reduce((sum, transfer) => 
            sum + (Number(transfer.price) || 0), 0),
          totalExpenses: totalExpenses,
          netIncome: capitalizedTransfers.reduce((sum, transfer) => 
            sum + (Number(transfer.price) || 0), 0) - totalExpenses
        });
      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast.error(`${capitalizeFirstLetter('error al cargar los datos del dashboard')}: ${error.message}`);
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
