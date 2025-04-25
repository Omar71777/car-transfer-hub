import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transfer, Expense } from '@/types';
import { useAuth } from '@/contexts/auth';
import { createTransfer } from './operations/createTransfer';
import { updateTransfer } from './operations/updateTransfer';
import { deleteTransfer } from './operations/deleteTransfer';

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchTransfers = useCallback(async () => {
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching transfers for user:', user.id);

      // First, fetch the transfers
      const { data: transfersData, error: transfersError } = await supabase
        .from('transfers')
        .select('*, client:clients(*)')
        .order('date', { ascending: false });

      if (transfersError) {
        console.error('Error fetching transfers:', transfersError);
        throw transfersError;
      }

      console.log(`Fetched ${transfersData.length} transfers`);

      // Get all transfer IDs to fetch related data
      const transferIds = transfersData.map((transfer: any) => transfer.id);

      // Then, get all expenses related to these transfers
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .in('transfer_id', transferIds);

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
        throw expensesError;
      }

      console.log(`Fetched ${expensesData.length} expenses`);

      // Get all extra charges for these transfers
      const { data: extraChargesData, error: extraChargesError } = await supabase
        .from('extra_charges')
        .select('*')
        .in('transfer_id', transferIds);

      if (extraChargesError) {
        console.error('Error fetching extra charges:', extraChargesError);
        throw extraChargesError;
      }

      console.log(`Fetched ${extraChargesData?.length || 0} extra charges`);

      // Group extra charges by transfer ID
      const extraChargesByTransferId: Record<string, any[]> = {};
      extraChargesData?.forEach((charge) => {
        if (!extraChargesByTransferId[charge.transfer_id]) {
          extraChargesByTransferId[charge.transfer_id] = [];
        }
        extraChargesByTransferId[charge.transfer_id].push(charge);
      });

      // Group expenses by transfer ID
      const expensesByTransferId: Record<string, any[]> = {};
      expensesData.forEach((expense: any) => {
        if (!expensesByTransferId[expense.transfer_id]) {
          expensesByTransferId[expense.transfer_id] = [];
        }
        expensesByTransferId[expense.transfer_id].push(expense);
      });

      // Add extra charges and expenses to each transfer
      const transfersWithRelatedData = transfersData.map((transfer: any) => ({
        ...transfer,
        expenses: expensesByTransferId[transfer.id] || [],
        extraCharges: extraChargesByTransferId[transfer.id] || []
      }));

      setTransfers(transfersWithRelatedData);
      setExpenses(expensesData);

      return transfersWithRelatedData;
    } catch (error) {
      console.error('Error in fetchTransfers:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch transfers on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTransfers();
    }
  }, [user, fetchTransfers]);

  const fetchTransfersInRange = useCallback(async (startDate: string, endDate: string) => {
    // Implementation for fetching transfers in a specific date range
    // This would be similar to fetchTransfers but with date filters
    return [];
  }, []);

  const fetchTransferById = useCallback(async (id: string) => {
    // Implementation for fetching a single transfer by ID
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
        extraCharges: extraChargesData || [],
        expenses: expensesData || []
      };
    } catch (error) {
      console.error('Error fetching transfer by ID:', error);
      return null;
    }
  }, [user]);

  const getTransfer = useCallback(async (id: string) => {
    if (!id) return null;
    
    // Check if we already have the transfer in state
    const existingTransfer = transfers.find(t => t.id === id);
    if (existingTransfer) return existingTransfer;
    
    // Otherwise fetch it
    return fetchTransferById(id);
  }, [transfers, fetchTransferById]);

  return {
    transfers,
    expenses,
    loading,
    fetchTransfers,
    fetchTransfersInRange,
    fetchTransferById,
    createTransfer: useCallback((transferData: any) => createTransfer(user, transferData), [user]),
    updateTransfer: useCallback((id: string, transferData: Partial<Transfer>) => updateTransfer(user, id, transferData), [user]),
    deleteTransfer: useCallback((id: string) => deleteTransfer(user, id, fetchTransfers), [user, fetchTransfers]),
    getTransfer
  };
}

// Re-export the hook for backward compatibility
export { useTransfers as useTransfersHook };
