
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
      payment_method, // Make sure to handle the payment method
      hours,
      vehicle_id, // Add vehicle_id
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
      payment_method: paymentStatus === 'paid' ? payment_method : null, // Only set payment method if paid
      client_id: clientId,
      vehicle_id: vehicle_id, // Include vehicle_id
      // Convert hours to number for database if it exists
      hours: hours !== undefined ? Number(hours) : undefined,
      origin: rest.origin?.toLowerCase(),
      destination: rest.destination?.toLowerCase(),
      collaborator: rest.collaborator?.toLowerCase(),
      updated_at: new Date().toISOString()
    };
    
    // Filter out undefined values to avoid setting null in the database
    Object.keys(dataForDb).forEach(key => {
      if (dataForDb[key] === undefined) {
        delete dataForDb[key];
      }
    });
    
    console.log('Updating transfer with data:', dataForDb);
    
    const { error } = await supabase
      .from('transfers')
      .update(dataForDb)
      .eq('id', id);

    if (error) {
      console.error('Error updating transfer:', error);
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
        console.error('Error deleting extra charges:', deleteError);
        throw deleteError;
      }
        
      // Then insert new ones
      if (extraCharges.length > 0) {
        // Filter out invalid extra charges
        const validExtraCharges = extraCharges.filter(charge => 
          charge && charge.name && charge.price
        );
        
        if (validExtraCharges.length > 0) {
          const extraChargesData = validExtraCharges.map(charge => ({
            transfer_id: id,
            name: charge.name,
            price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
          }));
          
          console.log('Inserting updated extra charges:', extraChargesData);
          
          const { error: insertError } = await supabase
            .from('extra_charges')
            .insert(extraChargesData);
            
          if (insertError) {
            console.error('Error inserting extra charges:', insertError);
            throw insertError;
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
