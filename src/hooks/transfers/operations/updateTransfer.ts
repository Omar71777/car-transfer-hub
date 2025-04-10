
import { supabase } from '@/integrations/supabase/client';
import { Transfer } from '@/types';
import { toast } from 'sonner';

export async function updateTransfer(user: any, id: string, transferData: Partial<Transfer>) {
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
      hours,
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
      // Convert hours to number for database if it exists
      hours: hours !== undefined ? Number(hours) : undefined,
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
        for (const charge of extraCharges) {
          const extraChargeData = {
            transfer_id: id,
            name: charge.name,
            price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
          };
          
          const { error: insertError } = await supabase
            .from('extra_charges')
            .insert(extraChargeData);
            
          if (insertError) {
            console.error('Error inserting extra charge:', insertError);
          }
        }
      }
    }

    return true;
  } catch (error: any) {
    console.error('Error updating transfer:', error);
    toast.error(`Error al actualizar el transfer: ${error.message}`);
    return false;
  }
}
