
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transfer } from '@/types';

export function useTransferOperations(user: any) {
  const createTransfer = useCallback(async (transferData: Omit<Transfer, 'id' | 'expenses' | 'extraCharges'>) => {
    if (!user) return null;
    
    try {
      // If collaborator is "none", save as null or empty string
      const collaboratorValue = transferData.collaborator === 'none' ? '' : transferData.collaborator.toLowerCase();
      
      // Create the transfer first
      const { data, error } = await supabase
        .from('transfers')
        .insert({
          date: transferData.date,
          time: transferData.time,
          service_type: transferData.serviceType,
          origin: transferData.origin.toLowerCase(),
          destination: transferData.destination?.toLowerCase(),
          price: transferData.price,
          discount_type: transferData.discountType,
          discount_value: transferData.discountValue || 0,
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

      // Then create any extra charges if they exist
      if (transferData.extraCharges && transferData.extraCharges.length > 0) {
        const extraChargesData = transferData.extraCharges.map(charge => ({
          transfer_id: data.id,
          name: charge.name,
          price: charge.price
        }));

        const { error: extraChargesError } = await supabase
          .from('extra_charges')
          .insert(extraChargesData);

        if (extraChargesError) {
          throw extraChargesError;
        }
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
      const { 
        expenses, 
        extraCharges, 
        serviceType,
        discountType, 
        discountValue, 
        commissionType, 
        clientId, 
        paymentStatus, 
        ...rest 
      } = transferData;
      
      // Convert camelCase to snake_case for database fields
      const dataForDb = {
        ...rest,
        service_type: serviceType,
        commission_type: commissionType,
        discount_type: discountType,
        discount_value: discountValue,
        payment_status: paymentStatus,
        client_id: clientId,
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

      // If updating extra charges
      if (extraCharges) {
        // First delete existing extra charges
        const { error: deleteError } = await supabase
          .from('extra_charges')
          .delete()
          .eq('transfer_id', id);
          
        if (deleteError) {
          throw deleteError;
        }
          
        // Then insert new ones
        if (extraCharges.length > 0) {
          const extraChargesData = extraCharges.map(charge => ({
            transfer_id: id,
            name: charge.name,
            price: charge.price
          }));
            
          const { error: insertError } = await supabase
            .from('extra_charges')
            .insert(extraChargesData);
            
          if (insertError) {
            throw insertError;
          }
        }
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
      // Delete expenses first (if any)
      const { error: expensesError } = await supabase
        .from('expenses')
        .delete()
        .eq('transfer_id', id);

      if (expensesError) {
        throw expensesError;
      }

      // Delete extra charges (if any)
      const { error: extraChargesError } = await supabase
        .from('extra_charges')
        .delete()
        .eq('transfer_id', id);

      if (extraChargesError) {
        throw extraChargesError;
      }

      // Finally delete the transfer
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
