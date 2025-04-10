
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transfer, Expense } from '@/types';
import { toast } from 'sonner';

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  transferCount: number;
  averageCommission: number;
}

export const useDataLoader = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    transferCount: 0,
    averageCommission: 0,
  });
  const [uniqueCollaborators, setUniqueCollaborators] = useState<string[]>([]);
  const [uniqueExpenseTypes, setUniqueExpenseTypes] = useState<string[]>([]);

  const fetchTransfers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('transfers')
        .select(`
          id,
          date,
          time,
          origin,
          destination,
          price,
          collaborator,
          commission,
          payment_status,
          payment_collaborator,
          expenses (
            id,
            date,
            concept,
            amount
          )
        `)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Transfer type
      const transformedData = data.map((transfer: any) => ({
        id: transfer.id,
        date: transfer.date,
        time: transfer.time || '',
        origin: transfer.origin,
        destination: transfer.destination,
        price: Number(transfer.price),
        collaborator: transfer.collaborator || '',
        commission: Number(transfer.commission),
        paymentStatus: transfer.payment_status || 'cobrado',
        paymentCollaborator: transfer.payment_collaborator || '',
        expenses: transfer.expenses.map((expense: any) => ({
          id: expense.id,
          transferId: transfer.id,
          date: expense.date,
          concept: expense.concept,
          amount: Number(expense.amount)
        }))
      }));

      setTransfers(transformedData);
      
      // Extract all expense items into a flat array
      const allExpenses = transformedData.flatMap(transfer => 
        transfer.expenses.map(expense => ({
          ...expense,
          transferId: transfer.id
        }))
      );
      
      setExpenses(allExpenses);
      
      // Extract unique collaborators and expense types
      const collaborators = Array.from(new Set(
        transformedData
          .filter(t => t.collaborator && t.collaborator.trim() !== '')
          .map(t => t.collaborator)
      ));
      
      const expenseTypes = Array.from(new Set(
        allExpenses
          .filter(e => e.concept && e.concept.trim() !== '')
          .map(e => e.concept)
      ));
      
      setUniqueCollaborators(collaborators);
      setUniqueExpenseTypes(expenseTypes);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(`Error al cargar los datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateStats = useCallback(() => {
    const totalRevenue = transfers.reduce((sum, transfer) => sum + transfer.price, 0);
    const totalExpenses = transfers.reduce((sum, transfer) => {
      return sum + transfer.expenses.reduce((expenseSum, expense) => expenseSum + expense.amount, 0);
    }, 0);
    const netProfit = totalRevenue - totalExpenses;
    const transferCount = transfers.length;
    const totalCommission = transfers.reduce((sum, transfer) => sum + transfer.commission, 0);
    const averageCommission = transferCount > 0 ? totalCommission / transferCount : 0;

    setStats({
      totalRevenue,
      totalExpenses,
      netProfit,
      transferCount,
      averageCommission,
    });
  }, [transfers]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  useEffect(() => {
    calculateStats();
  }, [transfers, calculateStats]);

  return {
    transfers,
    expenses,
    stats,
    isLoading,
    loading: isLoading, // Add this for backward compatibility
    fetchTransfers,
    uniqueCollaborators,
    uniqueExpenseTypes,
  };
};
