
import { useState, useEffect } from 'react';
import { Expense } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '@/lib/utils';
import { 
  calculateBasePrice, 
  calculateCommissionAmount, 
  calculateTotalPrice,
  MinimalTransfer 
} from '@/lib/calculations';

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
          .select('id, price, commission, commission_type, service_type, hours, origin, destination, collaborator, discount_type, discount_value')
          .order('date', { ascending: false });
          
        if (transfersError) throw transfersError;
        
        // Format transfers to match the MinimalTransfer interface
        const formattedTransfers: MinimalTransfer[] = transfers.map(transfer => ({
          serviceType: transfer.service_type || 'transfer',
          price: Number(transfer.price),
          commission: Number(transfer.commission) || 0,
          commissionType: transfer.commission_type || 'percentage',
          hours: transfer.hours || undefined,
          discountType: transfer.discount_type as 'percentage' | 'fixed' | null,
          discountValue: Number(transfer.discount_value) || 0,
          origin: capitalizeFirstLetter(transfer.origin),
          destination: capitalizeFirstLetter(transfer.destination),
          extraCharges: [],
        }));
        
        // Load expenses from Supabase
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount, concept')
          .order('date', { ascending: false });
          
        if (expensesError) throw expensesError;
        
        // Calculate total commissions with the correct method
        const totalCommissions = formattedTransfers.reduce((sum, transfer) => 
          sum + calculateCommissionAmount(transfer), 0);
        
        // Calculate total income with the correct price calculation
        const totalIncome = formattedTransfers.reduce((sum, transfer) => 
          sum + calculateTotalPrice(transfer), 0);
        
        // Add regular expenses and commissions
        const expensesTotal = expenses.reduce((sum, expense) => 
          sum + (Number(expense.amount) || 0), 0);
        const totalExpenses = expensesTotal + totalCommissions;
        
        // Calculate stats
        setStats({
          totalTransfers: formattedTransfers.length,
          totalIncome: totalIncome,
          totalExpenses: totalExpenses,
          netIncome: totalIncome - totalExpenses
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
