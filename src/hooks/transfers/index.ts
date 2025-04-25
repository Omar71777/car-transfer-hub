
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transfer, Expense } from '@/types';
import { useAuth } from '@/contexts/auth';
import { createTransfer } from './operations/createTransfer';
import { updateTransfer } from './operations/updateTransfer';
import { deleteTransfer } from './operations/deleteTransfer';
import { fetchAllTransfers } from './fetch/fetchAllTransfers';

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchTransfersAndSetState = useCallback(async () => {
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    try {
      setLoading(true);
      const data = await fetchAllTransfers(user);
      
      // Extract and format expenses
      const transformedExpenses: Expense[] = data.flatMap(transfer => 
        transfer.expenses.map(expense => ({
          id: expense.id,
          transferId: transfer.id,
          date: expense.date,
          concept: expense.concept,
          amount: expense.amount
        }))
      );

      setTransfers(data);
      setExpenses(transformedExpenses);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch transfers on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTransfersAndSetState();
    }
  }, [user, fetchTransfersAndSetState]);

  const fetchTransferById = useCallback(async (id: string) => {
    if (!user || !id) return null;
    
    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('*, client:clients(*)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Fetch extra charges for this transfer
      const { data: extraChargesData, error: extraChargesError } = await supabase
        .from('extra_charges')
        .select('*')
        .eq('transfer_id', id);
        
      if (extraChargesError) throw extraChargesError;
      
      // Fetch expenses for this transfer
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('transfer_id', id);
        
      if (expensesError) throw expensesError;
      
      return {
        ...data,
        serviceType: data.service_type === 'dispo' ? 'dispo' : 'transfer',
        extraCharges: extraChargesData || [],
        expenses: expensesData || []
      };
    } catch (error) {
      console.error('Error fetching transfer by ID:', error);
      return null;
    }
  }, [user]);

  return {
    transfers,
    expenses,
    loading,
    fetchTransfers: fetchTransfersAndSetState,
    fetchTransferById,
    createTransfer: useCallback((transferData: any) => createTransfer(user, transferData), [user]),
    updateTransfer: useCallback((id: string, transferData: Partial<Transfer>) => updateTransfer(user, id, transferData), [user]),
    deleteTransfer: useCallback((id: string) => deleteTransfer(user, id), [user])
  };
}

// Re-export the hook for backward compatibility
export { useTransfers as useTransfersHook };
