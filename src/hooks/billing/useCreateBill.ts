
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
      console.log('Starting bill creation with', {
        client: billData.clientId,
        transfersCount: billData.transferIds.length,
        taxRate: billData.taxRate,
        taxApp: billData.taxApplication,
      });

      // Validate required data
      if (!billData.clientId || !billData.transferIds.length) {
        console.error('Missing required bill data', billData);
        throw new Error('Datos incompletos para crear factura');
      }

      const preview = await calculateBillPreview(
        billData.clientId,
        billData.transferIds,
        billData.taxRate,
        billData.taxApplication
      );
      
      if (!preview) {
        console.error('Failed to calculate bill preview');
        throw new Error('No se pudo calcular la vista previa de la factura');
      }
      
      console.log('Creating bill with preview:', {
        clientId: billData.clientId,
        taxRate: billData.taxRate,
        taxApplication: billData.taxApplication,
        itemsCount: preview.items.length,
        previewItems: preview.items.map(item => ({
          transfer_id: item.transfer.id,
          description: item.description,
          extraCharges: item.extraCharges?.length || 0
        }))
      });
      
      const billNumber = await generateBillNumber();
      
      // Create the bill
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

      if (billError) {
        console.error('Error creating bill:', billError);
        throw billError;
      }
      
      if (!bill) {
        throw new Error('Failed to create bill record');
      }
      
      console.log('Bill created:', bill);
      
      // Prepare bill items array
      const billItems = [];
      
      // Process each item from the preview
      for (const item of preview.items) {
        if (!item.transfer || !item.transfer.id) {
          console.error('Missing transfer data in item:', item);
          continue;
        }
        
        // Calculate the base price correctly, accounting for service type
        const basePrice = calculateBasePrice(item.transfer);
        const discountAmount = calculateDiscountAmount(item.transfer);
        const finalBasePrice = basePrice - discountAmount;
        
        // Create the main transfer item
        let description = item.description || generateTransferDescription(item.transfer);
        
        // Add discount information to the description if there is a discount
        if (discountAmount > 0 && !description.includes('Descuento')) {
          const discountInfo = item.transfer.discountType === 'percentage' 
            ? `Descuento: ${item.transfer.discountValue}%` 
            : `Descuento: ${item.transfer.discountValue}€`;
          description += ` (${discountInfo})`;
        }
        
        // For dispo services, quantity is the number of hours and unit price is the hourly rate
        let quantity = 1;
        let unitPrice = finalBasePrice;
        
        if (item.transfer.serviceType === 'dispo' && item.transfer.hours) {
          quantity = Number(item.transfer.hours);
          unitPrice = Number(item.transfer.price);
        }
        
        const mainItem = {
          bill_id: bill.id,
          transfer_id: item.transfer.id,
          description: description,
          quantity: quantity,
          unit_price: unitPrice,
          total_price: quantity * unitPrice,
          is_extra_charge: false,
          parent_item_id: null
        };
        
        // Add the main transfer item
        billItems.push(mainItem);
        
        // Create and add extra charges as separate items
        if (item.extraCharges && item.extraCharges.length > 0) {
          console.log(`Adding ${item.extraCharges.length} extra charges for transfer ${item.transfer.id}`);
          
          // Add the extra charges as separate rows
          for (const charge of item.extraCharges) {
            if (!charge.name || !charge.price) {
              console.error('Invalid extra charge:', charge);
              continue;
            }
            
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
        const updateResult = await updateTransfer(item.transfer.id, { billed: true });
        if (!updateResult) {
          console.warn(`Failed to mark transfer ${item.transfer.id} as billed`);
        }
      }
      
      if (billItems.length === 0) {
        console.error('No valid bill items to insert');
        throw new Error('No se pudieron crear elementos de factura');
      }
      
      console.log(`Inserting ${billItems.length} bill items:`, billItems);
      
      // Insert all bill items with explicit error handling
      try {
        const { data: insertedItems, error: itemsError } = await supabase
          .from('bill_items')
          .insert(billItems)
          .select();

        if (itemsError) {
          console.error('Error inserting bill items:', itemsError);
          // Don't throw here - we want to return the bill ID even if items fail
          toast.error('La factura se creó, pero hubo un problema con los elementos');
        } else {
          console.log(`Successfully inserted ${insertedItems?.length || 0} bill items`);
        }
      } catch (itemInsertError) {
        console.error('Exception inserting bill items:', itemInsertError);
        // Don't throw here - return the bill ID even if items fail
        toast.error('La factura se creó, pero hubo un problema con los elementos');
      }
      
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
