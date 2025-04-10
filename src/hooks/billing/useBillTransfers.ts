
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBillTransfers(
  getBill: (id: string) => Promise<any>,
  getTransfer: (id: string) => Promise<any>, 
  updateTransfer: (id: string, data: any) => Promise<boolean>
) {
  const updateBillTransfers = useCallback(async (billId: string, addedTransferIds: string[], removedTransferIds: string[]) => {
    try {
      // Get the current bill
      const bill = await getBill(billId);
      if (!bill) throw new Error('Factura no encontrada');

      // 1. First remove transfers that need to be removed
      if (removedTransferIds.length > 0) {
        // Delete the bill_items entries
        const { error: removeItemsError } = await supabase
          .from('bill_items')
          .delete()
          .eq('bill_id', billId)
          .in('transfer_id', removedTransferIds);

        if (removeItemsError) throw removeItemsError;

        // Mark transfers as unbilled
        for (const transferId of removedTransferIds) {
          await updateTransfer(transferId, { billed: false });
        }
      }

      // 2. Add new transfers
      if (addedTransferIds.length > 0) {
        const billItems = [];
        let additionalSubtotal = 0;
        
        // Process each transfer to add
        for (const transferId of addedTransferIds) {
          const transfer = await getTransfer(transferId);
          if (!transfer) continue;

          // Add to bill items
          billItems.push({
            bill_id: billId,
            transfer_id: transferId,
            description: `Transfer desde ${transfer.origin} hasta ${transfer.destination} el ${transfer.date}`,
            quantity: 1,
            unit_price: transfer.price,
            total_price: transfer.price,
          });
          
          // Add to subtotal
          additionalSubtotal += transfer.price;
          
          // Mark as billed
          await updateTransfer(transferId, { billed: true });
        }
        
        // Insert the new bill items
        if (billItems.length > 0) {
          const { error: addItemsError } = await supabase
            .from('bill_items')
            .insert(billItems);

          if (addItemsError) throw addItemsError;
        }
        
        // Recalculate bill totals
        const newSubTotal = bill.sub_total + additionalSubtotal;
        let newTaxAmount;
        let newTotal;
        
        if (bill.tax_application === 'included') {
          newTaxAmount = (newSubTotal * bill.tax_rate) / (100 + bill.tax_rate);
          newTotal = newSubTotal;
        } else {
          newTaxAmount = (newSubTotal * bill.tax_rate) / 100;
          newTotal = newSubTotal + newTaxAmount;
        }
        
        // Update bill with new totals
        const { error: updateBillError } = await supabase
          .from('bills')
          .update({
            sub_total: newSubTotal,
            tax_amount: newTaxAmount,
            total: newTotal,
            updated_at: new Date().toISOString()
          })
          .eq('id', billId);
          
        if (updateBillError) throw updateBillError;
      }
      
      // Recalculate bill totals if there were removals but no additions
      if (removedTransferIds.length > 0 && addedTransferIds.length === 0) {
        // Fetch all remaining items
        const { data: remainingItems, error: itemsError } = await supabase
          .from('bill_items')
          .select('*')
          .eq('bill_id', billId);
          
        if (itemsError) throw itemsError;
        
        // Calculate new subtotal
        const newSubTotal = (remainingItems || []).reduce((sum, item) => sum + item.total_price, 0);
        let newTaxAmount;
        let newTotal;
        
        if (bill.tax_application === 'included') {
          newTaxAmount = (newSubTotal * bill.tax_rate) / (100 + bill.tax_rate);
          newTotal = newSubTotal;
        } else {
          newTaxAmount = (newSubTotal * bill.tax_rate) / 100;
          newTotal = newSubTotal + newTaxAmount;
        }
        
        // Update bill with new totals
        const { error: updateBillError } = await supabase
          .from('bills')
          .update({
            sub_total: newSubTotal,
            tax_amount: newTaxAmount,
            total: newTotal,
            updated_at: new Date().toISOString()
          })
          .eq('id', billId);
          
        if (updateBillError) throw updateBillError;
      }
      
      toast.success('Transfers de la factura actualizados con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al actualizar transfers de la factura: ${error.message}`);
      console.error('Error updating bill transfers:', error);
      return false;
    }
  }, [getBill, getTransfer, updateTransfer]);

  return { updateBillTransfers };
}
