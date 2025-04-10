import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Transfer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransfers = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use 'from' instead of directly accessing the table name
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
        expenses: transfer.expenses.map((expense: any) => ({
          id: expense.id,
          transferId: transfer.id,
          date: expense.date,
          concept: expense.concept,
          amount: Number(expense.amount)
        }))
      }));

      setTransfers(transformedData);
    } catch (error: any) {
      console.error('Error fetching transfers:', error);
      toast.error(`Error al cargar los transfers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const createTransfer = useCallback(async (transferData: Omit<Transfer, 'id' | 'expenses'>) => {
    if (!user) return null;
    
    try {
      // Use 'from' instead of directly accessing the table name
      const { data, error } = await supabase
        .from('transfers')
        .insert({
          date: transferData.date,
          time: transferData.time,
          origin: transferData.origin,
          destination: transferData.destination,
          price: transferData.price,
          collaborator: transferData.collaborator,
          commission: transferData.commission
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      return data.id as string;
    } catch (error: any) {
      console.error('Error creating transfer:', error);
      toast.error(`Error al crear el transfer: ${error.message}`);
      return null;
    }
  }, [user]);

  const updateTransfer = useCallback(async (id: string, transferData: Partial<Transfer>) => {
    if (!user) return false;
    
    try {
      // Remove 'expenses' field if it exists as we don't want to update it
      const { expenses, ...transferUpdateData } = transferData;
      
      // Use 'from' instead of directly accessing the table name
      const { error } = await supabase
        .from('transfers')
        .update({
          ...transferUpdateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error updating transfer:', error);
      toast.error(`Error al actualizar el transfer: ${error.message}`);
      return false;
    }
  }, [user]);

  const deleteTransfer = useCallback(async (id: string) => {
    if (!user) return false;
    
    try {
      // First delete associated expenses
      // Use 'from' instead of directly accessing the table name
      const { error: expensesError } = await supabase
        .from('expenses')
        .delete()
        .eq('transfer_id', id);

      if (expensesError) {
        throw expensesError;
      }

      // Then delete the transfer
      // Use 'from' instead of directly accessing the table name
      const { error } = await supabase
        .from('transfers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error deleting transfer:', error);
      toast.error(`Error al eliminar el transfer: ${error.message}`);
      return false;
    }
  }, [user]);

  return {
    transfers,
    loading,
    fetchTransfers,
    createTransfer,
    updateTransfer,
    deleteTransfer
  };
}
