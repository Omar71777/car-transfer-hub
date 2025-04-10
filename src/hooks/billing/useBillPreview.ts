
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
          
          // Add extra charges total
          const extraChargesTotal = calculateExtraChargesTotal(extraCharges || []);
          
          // Apply discount
          const discountAmount = calculateDiscountAmount(formattedTransfer);
          
          // Final transfer price
          const finalPrice = basePrice + extraChargesTotal - discountAmount;

          // Create description based on service type
          const description = generateTransferDescription(transfer, extraCharges);

          const item = {
            transfer,
            description,
            unitPrice: finalPrice,
          };

          items.push(item);
          subTotal += finalPrice;
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
