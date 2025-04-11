
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateBillDto } from '@/types/billing';
import { toast } from 'sonner';
import { useBillPreview } from './useBillPreview';
import { useBillNumber } from './useBillNumber';
import { calculateBasePrice, calculateDiscountAmount } from '@/lib/calculations';
import { generateTransferDescription, generateExtraChargeDescription } from '@/lib/billing/calculationUtils';

export function useCreateBill(
  getClient: (id: string) => Promise<any>,
  getTransfer: (id: string) => Promise<any>,
  updateTransfer: (id: string, data: any) => Promise<boolean>
) {
  const { calculateBillPreview } = useBillPreview(getClient, getTransfer);
  const { generateBillNumber } = useBillNumber();

  const createBill = useCallback(async (billData: CreateBillDto) => {
    try {
      const preview = await calculateBillPreview(
        billData.clientId,
        billData.transferIds,
        billData.taxRate,
        billData.taxApplication
      );
      
      if (!preview) throw new Error('No se pudo calcular la vista previa de la factura');
      
      const billNumber = await generateBillNumber();
      
      const { data: bill, error: billError } = await supabase
        .from('bills')
        .insert([{
          client_id: billData.clientId,
          number: billNumber,
          date: billData.date,
          due_date: billData.dueDate,
          sub_total: preview.subTotal,
          tax_rate: billData.taxRate,
          tax_amount: preview.taxAmount,
          tax_application: billData.taxApplication,
          total: preview.total,
          notes: billData.notes,
          status: 'draft',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (billError) throw billError;
      
      const billItems = [];
      
      for (const item of preview.items) {
        // Calculate the base price correctly, accounting for service type
        const basePrice = calculateBasePrice(item.transfer);
        const discountAmount = calculateDiscountAmount(item.transfer);
        const finalBasePrice = basePrice - discountAmount;
        
        // Create the main transfer item
        const description = generateTransferDescription(item.transfer);
        
        const mainItem = {
          bill_id: bill.id,
          transfer_id: item.transfer.id,
          description: description,
          quantity: 1,
          unit_price: finalBasePrice,
          total_price: finalBasePrice,
          is_extra_charge: false,
          parent_item_id: null
        };
        
        // Add the main transfer item
        billItems.push(mainItem);
        
        // Create and add extra charges as separate items
        if (item.extraCharges && item.extraCharges.length > 0) {
          // Add the extra charges as separate rows
          for (const charge of item.extraCharges) {
            billItems.push({
              bill_id: bill.id,
              transfer_id: item.transfer.id,
              description: charge.name,
              quantity: 1,
              unit_price: charge.price,
              total_price: charge.price,
              is_extra_charge: true,
              extra_charge_id: charge.id,
              parent_item_id: null // Will be set after main item is inserted
            });
          }
        }
        
        // Mark the transfer as billed
        await updateTransfer(item.transfer.id, { billed: true });
      }
      
      // Insert all bill items
      const { data: insertedItems, error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItems)
        .select();

      if (itemsError) throw itemsError;
      
      toast.success('Factura creada con éxito');
      return bill.id;
    } catch (error: any) {
      toast.error(`Error al crear factura: ${error.message}`);
      console.error('Error creating bill:', error);
      return null;
    }
  }, [calculateBillPreview, generateBillNumber, updateTransfer]);

  return { createBill };
}
