
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transfer } from '@/types';

export function useTransferOperations(user: any) {
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
          client_id: transferData.clientId // This is correct - converting camelCase to snake_case
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
      const { expenses, commissionType, clientId, paymentStatus, ...rest } = transferData;
      
      // Convert camelCase to snake_case for database fields
      const dataForDb = {
        ...rest,
        commission_type: commissionType,
        payment_status: paymentStatus,
        client_id: clientId, // Fix: use client_id instead of clientId for database
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

  return { createTransfer, updateTransfer, deleteTransfer, getTransfer };
}
