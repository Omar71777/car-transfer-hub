import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bill, ExtraChargeBillItem } from '@/types/billing';
import { toast } from 'sonner';

export function useBillOperations() {
  const getBill = useCallback(async (id: string) => {
    try {
      const { data: bill, error } = await supabase
        .from('bills')
        .select(`
          *,
          client:client_id (
            id,
            name,
            email,
            phone,
            address,
            tax_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const { data: items, error: itemsError } = await supabase
        .from('bill_items')
        .select('*')
        .eq('bill_id', id);

      if (itemsError) throw itemsError;
      
      const transferIds = [...new Set(items.map(item => item.transfer_id))];
      
      const itemsWithExtraCharges = await Promise.all(items.map(async (item) => {
        if (!item.is_extra_charge) {
          const { data: extraCharges } = await supabase
            .from('extra_charges')
            .select('*')
            .eq('transfer_id', item.transfer_id);
          
          const formattedExtraCharges = (extraCharges || []).map(charge => ({
            id: charge.id,
            name: charge.name,
            price: Number(charge.price) || 0
          }));
          
          return {
            ...item,
            extra_charges: formattedExtraCharges
          };
        }
        
        return item;
      }));
      
      return {
        ...bill,
        items: itemsWithExtraCharges || []
      } as unknown as Bill;
    } catch (error: any) {
      toast.error(`Error al obtener factura: ${error.message}`);
      console.error('Error fetching bill:', error);
      return null;
    }
  }, []);

  const updateBill = useCallback(async (id: string, data: Partial<Bill>) => {
    try {
      const updateData: any = {};
      
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.date !== undefined) updateData.date = data.date;
      if (data.due_date !== undefined) updateData.due_date = data.due_date;
      if (data.tax_rate !== undefined) updateData.tax_rate = data.tax_rate;
      if (data.tax_application !== undefined) updateData.tax_application = data.tax_application;
      if (data.number !== undefined) updateData.number = data.number;
      
      if (Object.keys(updateData).length === 0) {
        return false;
      }
      
      updateData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('bills')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Factura actualizada con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al actualizar factura: ${error.message}`);
      console.error('Error updating bill:', error);
      return false;
    }
  }, []);

  const updateBillStatus = useCallback(async (id: string, status: Bill['status']) => {
    try {
      const statusMessage = {
        draft: 'borrador',
        sent: 'enviada',
        paid: 'pagada',
        cancelled: 'cancelada'
      };
      
      const { error } = await supabase
        .from('bills')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Estado de la factura actualizado a "${statusMessage[status]}"`);
      return true;
    } catch (error: any) {
      toast.error(`Error al actualizar estado de factura: ${error.message}`);
      console.error('Error updating bill status:', error);
      return false;
    }
  }, []);

  const deleteBill = useCallback(async (id: string, updateTransfer: (id: string, data: any) => Promise<boolean>) => {
    try {
      const { data: billItems, error: itemsQueryError } = await supabase
        .from('bill_items')
        .select('transfer_id')
        .eq('bill_id', id);

      if (itemsQueryError) throw itemsQueryError;
      
      const { error: itemsDeleteError } = await supabase
        .from('bill_items')
        .delete()
        .eq('bill_id', id);

      if (itemsDeleteError) throw itemsDeleteError;
      
      for (const item of billItems || []) {
        await updateTransfer(item.transfer_id, { billed: false });
      }
      
      const { error: billDeleteError } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (billDeleteError) throw billDeleteError;
      
      toast.success('Factura eliminada con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al eliminar factura: ${error.message}`);
      console.error('Error deleting bill:', error);
      return false;
    }
  }, []);

  return {
    getBill,
    updateBill,
    updateBillStatus,
    deleteBill
  };
}
