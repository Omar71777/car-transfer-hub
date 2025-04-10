
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function createTransfer(user: any, transferData: any) {
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
      const extraChargesData = transferData.extraCharges.map((charge: any) => ({
        transfer_id: data.id,
        name: charge.name,
        price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
      }));

      // Insert extra charges one by one
      for (const charge of extraChargesData) {
        const { error: extraChargeError } = await supabase
          .from('extra_charges')
          .insert(charge);
        
        if (extraChargeError) {
          console.error('Error adding extra charge:', extraChargeError);
        }
      }
    }

    return data.id as string;
  } catch (error: any) {
    console.error('Error creating transfer:', error);
    toast.error(`Error al crear el transfer: ${error.message}`);
    return null;
  }
}
