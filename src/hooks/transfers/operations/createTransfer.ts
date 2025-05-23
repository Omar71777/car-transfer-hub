
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function createTransfer(user: any, transferData: any) {
  console.log('Creating transfer with user:', user ? user.id : 'No user');
  console.log('Transfer data received:', JSON.stringify(transferData, null, 2));
  
  if (!user) {
    console.error('No authenticated user found');
    toast.error('Debe iniciar sesión para crear un transfer');
    return null;
  }
  
  try {
    // Validate required fields
    const requiredFields = ['date', 'origin', 'price', 'clientId'];
    const missingFields = requiredFields.filter(field => !transferData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      toast.error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
      return null;
    }
    
    // Handle service type specific fields
    if (transferData.serviceType === 'transfer' && !transferData.destination) {
      console.error('Missing destination for transfer service type');
      toast.error('El destino es obligatorio para transfers');
      return null;
    }
    
    if (transferData.serviceType === 'dispo' && !transferData.hours) {
      console.error('Missing hours for dispo service type');
      toast.error('Las horas son obligatorias para disposiciones');
      return null;
    }
    
    // Format data for insertion
    // If collaborator is "none" or empty, save as empty string
    // If it's "servicio propio", save that value directly
    let collaboratorValue = '';
    if (transferData.collaborator === 'servicio propio') {
      collaboratorValue = 'servicio propio';
    } else if (transferData.collaborator !== 'none' && transferData.collaborator) {
      collaboratorValue = transferData.collaborator;
    }
    
    console.log('Preparing transfer data for database insertion');
    console.log('Collaborator value:', collaboratorValue);
    
    // Prepare data for insertion
    const insertData = {
      date: transferData.date,
      time: transferData.time || '',
      service_type: transferData.serviceType,
      origin: transferData.origin.toLowerCase(),
      destination: transferData.serviceType === 'transfer' 
        ? transferData.destination?.toLowerCase() 
        : 'N/A', // Default value for dispo service
      hours: transferData.serviceType === 'dispo' ? Number(transferData.hours) : null,
      price: transferData.price,
      discount_type: transferData.discountType,
      discount_value: transferData.discountValue || 0,
      collaborator: collaboratorValue,
      commission: transferData.commission || 0,
      commission_type: transferData.commissionType,
      payment_status: transferData.paymentStatus,
      payment_method: transferData.payment_method || null,  // Explicitly handle payment method
      client_id: transferData.clientId,
      vehicle_id: transferData.vehicle_id || null,  // Add vehicle ID
      user_id: user.id // Explicitly set user_id for RLS
    };

    console.log('Final transfer data for insertion:', insertData);
    
    // Create the transfer first
    const { data, error } = await supabase
      .from('transfers')
      .insert(insertData)
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
        
        // Insert all extra charges in a single operation
        const { error: extraChargesError } = await supabase
          .from('extra_charges')
          .insert(extraChargesData);
        
        if (extraChargesError) {
          console.error('Error adding extra charges:', extraChargesError);
          toast.error(`Error al añadir cargos extra: ${extraChargesError.message}`);
          // Continue anyway since the transfer was created
        } else {
          console.log('Extra charges added successfully');
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
