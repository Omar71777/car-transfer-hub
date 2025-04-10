import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Transfer } from '@/types';
import { useAuth } from '@/contexts/auth';
import { capitalizeFirstLetter } from '@/lib/utils';

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransfers = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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

      const transformedData = data.map((transfer: any) => ({
        id: transfer.id,
        date: transfer.date,
        time: transfer.time || '',
        origin: capitalizeFirstLetter(transfer.origin),
        destination: capitalizeFirstLetter(transfer.destination),
        price: Number(transfer.price),
        collaborator: transfer.collaborator ? capitalizeFirstLetter(transfer.collaborator) : '',
        commission: Number(transfer.commission),
        commissionType: 'percentage' as const,
        paymentStatus: transfer.payment_status || 'pending',
        expenses: transfer.expenses.map((expense: any) => ({
          id: expense.id,
          transferId: transfer.id,
          date: expense.date,
          concept: capitalizeFirstLetter(expense.concept),
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
      const { data, error } = await supabase
        .from('transfers')
        .insert({
          date: transferData.date,
          time: transferData.time,
          origin: transferData.origin.toLowerCase(),
          destination: transferData.destination.toLowerCase(),
          price: transferData.price,
          collaborator: transferData.collaborator.toLowerCase(),
          commission: transferData.commission,
          payment_status: transferData.paymentStatus
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
      const { expenses, commissionType, ...transferUpdateData } = transferData;
      
      const { paymentStatus, ...rest } = transferUpdateData;
      const dataForDb = {
        ...rest,
        payment_status: paymentStatus,
        origin: rest.origin?.toLowerCase(),
        destination: rest.destination?.toLowerCase(),
        collaborator: rest.collaborator?.toLowerCase(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('transfers')
        .update(dataForDb)
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
      const { error: expensesError } = await supabase
        .from('expenses')
        .delete()
        .eq('transfer_id', id);

      if (expensesError) {
        throw expensesError;
      }

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

  const getTransfer = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching transfer:', error);
      return null;
    }
  }, []);

  return {
    transfers,
    loading,
    fetchTransfers,
    createTransfer,
    updateTransfer,
    deleteTransfer,
    getTransfer
  };
}
