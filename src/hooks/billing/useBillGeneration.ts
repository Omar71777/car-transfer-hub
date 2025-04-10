
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BillPreview, CreateBillDto, TaxApplicationType } from '@/types/billing';
import { toast } from 'sonner';
import { 
  calculateBasePrice, 
  calculateDiscountAmount, 
  calculateExtraChargesTotal, 
  calculateTotalPrice, 
  adaptExtraCharges,
  MinimalTransfer
} from '@/lib/calculations';

export function useBillGeneration(
  getClient: (id: string) => Promise<any>,
  getTransfer: (id: string) => Promise<any>,
  updateTransfer: (id: string, data: any) => Promise<boolean>
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
          const formattedTransfer: MinimalTransfer = {
            id: transfer.id,
            serviceType: transfer.service_type || 'transfer',
            price: Number(transfer.price),
            hours: transfer.hours || undefined,
            discountType: transfer.discount_type,
            discountValue: Number(transfer.discount_value) || 0,
            destination: transfer.destination,
            origin: transfer.origin,
            date: transfer.date,
            extraCharges: adaptExtraCharges(extraCharges || []),
            commission: Number(transfer.commission) || 0,
            commissionType: transfer.commission_type || 'percentage'
          };
          
          // Calculate base price (considering service type)
          const basePrice = calculateBasePrice(formattedTransfer);
          
          // Add extra charges total
          const extraChargesTotal = calculateExtraChargesTotal(extraCharges || []);
          
          // Apply discount
          const discountAmount = calculateDiscountAmount(formattedTransfer);
          
          // Final transfer price
          const finalPrice = basePrice + extraChargesTotal - discountAmount;

          // Create description based on service type
          let description = '';
          if (transfer.service_type === 'transfer') {
            description = `Transfer desde ${transfer.origin} hasta ${transfer.destination} el ${transfer.date}`;
          } else {
            description = `Servicio de disposición por ${transfer.hours} horas desde ${transfer.origin} el ${transfer.date}`;
          }
          
          // Add extra charges description if any
          if (extraCharges && extraCharges.length > 0) {
            description += ` (incluye ${extraCharges.length} cargo${extraCharges.length !== 1 ? 's' : ''} extra${extraCharges.length !== 1 ? 's' : ''})`;
          }
          
          // Add discount description if any
          if (transfer.discount_type && transfer.discount_value) {
            const discountDesc = transfer.discount_type === 'percentage' 
              ? `${transfer.discount_value}%` 
              : `${transfer.discount_value}€`;
            description += ` (descuento de ${discountDesc})`;
          }

          const item = {
            transfer,
            description,
            unitPrice: finalPrice,
          };

          items.push(item);
          subTotal += finalPrice;
        }

        let taxAmount = 0;
        let total = 0;

        if (taxApplication === 'included') {
          taxAmount = (subTotal * taxRate) / (100 + taxRate);
          total = subTotal;
        } else {
          taxAmount = (subTotal * taxRate) / 100;
          total = subTotal + taxAmount;
        }

        return {
          client,
          items,
          subTotal,
          taxRate,
          taxAmount,
          taxApplication,
          total,
        } as BillPreview;
      } catch (error: any) {
        toast.error(`Error al calcular vista previa: ${error.message}`);
        console.error('Error calculating bill preview:', error);
        return null;
      }
    },
    [getClient, getTransfer]
  );

  const generateBillNumber = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('bills')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      
      const year = new Date().getFullYear();
      const number = (count || 0) + 1;
      
      return `FACTURA-${year}-${number.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating bill number:', error);
      return `FACTURA-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    }
  }, []);

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
        billItems.push({
          bill_id: bill.id,
          transfer_id: item.transfer.id,
          description: item.description,
          quantity: 1,
          unit_price: item.unitPrice,
          total_price: item.unitPrice,
        });
        
        await updateTransfer(item.transfer.id, { billed: true });
      }
      
      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItems);

      if (itemsError) throw itemsError;
      
      toast.success('Factura creada con éxito');
      return bill.id;
    } catch (error: any) {
      toast.error(`Error al crear factura: ${error.message}`);
      console.error('Error creating bill:', error);
      return null;
    }
  }, [calculateBillPreview, generateBillNumber, updateTransfer]);

  return {
    calculateBillPreview,
    generateBillNumber,
    createBill
  };
}
