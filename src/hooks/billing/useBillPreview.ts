
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BillPreview, TaxApplicationType } from '@/types/billing';
import { toast } from 'sonner';
import { 
  calculateBasePrice, 
  calculateDiscountAmount, 
  calculateExtraChargesTotal, 
  adaptExtraCharges
} from '@/lib/calculations';
import {
  formatTransferForCalculations,
  generateTransferDescription,
  generateExtraChargeDescription,
  calculateTaxTotals,
  createBillPreview
} from '@/lib/billing/calculationUtils';

export function useBillPreview(
  getClient: (id: string) => Promise<any>,
  getTransfer: (id: string) => Promise<any>
) {
  const calculateBillPreview = useCallback(
    async (clientId: string, transferIds: string[], taxRate: number, taxApplication: TaxApplicationType) => {
      try {
        const client = await getClient(clientId);
        if (!client) throw new Error('Cliente no encontrado');

        let items = [];
        let subTotal = 0;

        for (const transferId of transferIds) {
          const transfer = await getTransfer(transferId);
          if (!transfer) continue;

          // Get any extra charges for this transfer directly from API
          const { data: extraCharges } = await supabase
            .from('extra_charges')
            .select('*')
            .eq('transfer_id', transferId);
            
          // Create a formatted transfer for calculations
          const formattedTransfer = formatTransferForCalculations(transfer);
          formattedTransfer.extraCharges = adaptExtraCharges(extraCharges || []);
          
          // Calculate base price (considering service type)
          const basePrice = calculateBasePrice(formattedTransfer);
          
          // Apply discount
          const discountAmount = calculateDiscountAmount(formattedTransfer);
          
          // Final transfer base price after discount
          const finalBasePrice = basePrice - discountAmount;

          // Create description based on service type
          const description = generateTransferDescription(transfer);

          // For dispo services, quantity is hours and unit price is hourly rate
          let unitPrice = finalBasePrice;
          if (transfer.serviceType === 'dispo' && transfer.hours) {
            unitPrice = Number(transfer.price || 0);
          }

          // Create the main transfer item
          const transferItem = {
            transfer,
            description,
            unitPrice,
            extraCharges: []
          };
          
          // Add the main transfer item
          items.push(transferItem);
          
          // Add to subtotal (for dispo, it's hours * price)
          if (transfer.serviceType === 'dispo' && transfer.hours) {
            subTotal += unitPrice * Number(transfer.hours);
          } else {
            subTotal += unitPrice;
          }
          
          // Add extra charges as separate items in the preview
          if (extraCharges && extraCharges.length > 0) {
            // Convert and add extra charges
            const formattedExtraCharges = extraCharges.map(charge => ({
              id: charge.id,
              name: charge.name,
              price: Number(charge.price) || 0
            }));
            
            // Add the extra charges to the transfer item
            transferItem.extraCharges = formattedExtraCharges;
            
            // Add the extra charges to the total
            for (const charge of formattedExtraCharges) {
              subTotal += charge.price;
            }
          }
        }

        // Calculate tax amount and total
        const { taxAmount, total } = calculateTaxTotals(subTotal, taxRate, taxApplication);

        // Create and return the bill preview
        return createBillPreview(
          client,
          items,
          subTotal,
          taxRate,
          taxAmount,
          taxApplication,
          total
        );
      } catch (error: any) {
        toast.error(`Error al calcular vista previa: ${error.message}`);
        console.error('Error calculating bill preview:', error);
        return null;
      }
    },
    [getClient, getTransfer]
  );

  return { calculateBillPreview };
}
