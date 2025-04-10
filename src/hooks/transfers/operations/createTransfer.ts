
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function createTransfer(user: any, transferData: any) {
  console.log('Creating transfer with user:', user ? user.id : 'No user');
  console.log('Transfer data received:', transferData);
  
  if (!user) {
    console.error('No authenticated user found');
    toast.error('Debe iniciar sesión para crear un transfer');
    return null;
  }
  
  try {
    // Validate required fields
    if (!transferData.date || !transferData.origin || !transferData.price || !transferData.clientId) {
      console.error('Missing required fields:', { 
        date: transferData.date,
        origin: transferData.origin, 
        price: transferData.price, 
        clientId: transferData.clientId 
      });
      toast.error('Faltan campos requeridos para crear el transfer');
      return null;
    }
    
    // Format data for insertion
    // If collaborator is "none", save as null or empty string
    const collaboratorValue = transferData.collaborator === 'none' ? '' : transferData.collaborator?.toLowerCase();
    
    console.log('Preparing transfer data for database insertion');
    
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
      console.error('Error inserting transfer:', error);
      toast.error(`Error al crear el transfer: ${error.message}`);
      return null;
    }

    console.log('Transfer created successfully with ID:', data.id);

    // Then create any extra charges if they exist
    if (transferData.extraCharges && transferData.extraCharges.length > 0) {
      console.log('Processing extra charges:', transferData.extraCharges);
      
      const validExtraCharges = transferData.extraCharges.filter((charge: any) => 
        charge && charge.name && charge.price && charge.name.trim() !== ''
      );
      
      if (validExtraCharges.length > 0) {
        const extraChargesData = validExtraCharges.map((charge: any) => ({
          transfer_id: data.id,
          name: charge.name,
          price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
        }));

        console.log('Inserting extra charges:', extraChargesData);
        
        // Insert extra charges one by one
        for (const charge of extraChargesData) {
          const { error: extraChargeError } = await supabase
            .from('extra_charges')
            .insert(charge);
          
          if (extraChargeError) {
            console.error('Error adding extra charge:', extraChargeError);
            // Continue with other charges even if one fails
          }
        }
      }
    }

    toast.success('Transfer creado exitosamente');
    return data.id as string;
  } catch (error: any) {
    console.error('Error creating transfer:', error);
    toast.error(`Error al crear el transfer: ${error.message}`);
    return null;
  }
}
