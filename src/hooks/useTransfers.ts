
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
      // Remove the clients relationship which was causing the error
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
          commission_type,
          payment_status,
          client_id,
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

      // Get all clients to manually join with transfers
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name, email');

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
      }

      // Create a map of clients for easy lookup
      const clientsMap = (clientsData || []).reduce((acc, client) => {
        acc[client.id] = client;
        return acc;
      }, {});

      const transformedData = data.map((transfer: any) => ({
        id: transfer.id,
        date: transfer.date,
        time: transfer.time || '',
        origin: capitalizeFirstLetter(transfer.origin),
        destination: capitalizeFirstLetter(transfer.destination),
        price: Number(transfer.price),
        collaborator: transfer.collaborator && transfer.collaborator !== 'none' ? capitalizeFirstLetter(transfer.collaborator) : '',
        commission: Number(transfer.commission),
        commissionType: transfer.commission_type || 'percentage',
        paymentStatus: transfer.payment_status || 'pending',
        clientId: transfer.client_id || '',
        // Manually attach client data if it exists
        client: transfer.client_id && clientsMap[transfer.client_id] ? {
          id: clientsMap[transfer.client_id].id,
          name: clientsMap[transfer.client_id].name,
          email: clientsMap[transfer.client_id].email
        } : undefined,
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
      // If collaborator is "none", save as null or empty string
      const collaboratorValue = transferData.collaborator === 'none' ? '' : transferData.collaborator.toLowerCase();
      
      const { data, error } = await supabase
        .from('transfers')
        .insert({
          date: transferData.date,
          time: transferData.time,
          origin: transferData.origin.toLowerCase(),
          destination: transferData.destination.toLowerCase(),
          price: transferData.price,
          collaborator: collaboratorValue,
          commission: transferData.commission,
          commission_type: transferData.commissionType,
          payment_status: transferData.paymentStatus,
          client_id: transferData.clientId
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
