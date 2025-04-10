
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Transfer } from '@/types';

export async function fetchAllTransfers(user: any) {
  if (!user) return [];
  
  try {
    // Fetch transfers
    const { data, error } = await supabase
      .from('transfers')
      .select(`
        id,
        date,
        time,
        service_type,
        origin,
        destination,
        price,
        discount_type,
        discount_value,
        collaborator,
        commission,
        commission_type,
        payment_status,
        client_id,
        expenses (
          id,
          date,
          concept,
          amount
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    // Get all clients to manually join with transfers
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, email');

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
    }

    // Fetch extra charges for all transfers
    const transferIds = data.map((transfer: any) => transfer.id);
    let extraChargesMap: Record<string, any[]> = {};
    
    if (transferIds.length > 0) {
      // We need to get extra charges separately
      const { data: allExtraCharges } = await supabase
        .from('extra_charges')
        .select('*')
        .in('transfer_id', transferIds);
        
      // Group extra charges by transfer ID for easy lookup
      if (allExtraCharges) {
        extraChargesMap = allExtraCharges.reduce((acc: Record<string, any[]>, charge: any) => {
          if (!acc[charge.transfer_id]) {
            acc[charge.transfer_id] = [];
          }
          acc[charge.transfer_id].push(charge);
          return acc;
        }, {});
      }
    }

    // Create a map of clients for easy lookup
    const clientsMap = (clientsData || []).reduce((acc: any, client: any) => {
      acc[client.id] = client;
      return acc;
    }, {});

    return data.map((transfer: any) => ({
      id: transfer.id,
      date: transfer.date,
      time: transfer.time || '',
      serviceType: transfer.service_type || 'transfer',
      origin: capitalizeFirstLetter(transfer.origin),
      destination: transfer.destination ? capitalizeFirstLetter(transfer.destination) : undefined,
      price: Number(transfer.price),
      discountType: transfer.discount_type,
      discountValue: Number(transfer.discount_value) || 0,
      collaborator: transfer.collaborator && transfer.collaborator !== 'none' ? capitalizeFirstLetter(transfer.collaborator) : '',
      commission: Number(transfer.commission) || 0,
      commissionType: transfer.commission_type || 'percentage',
      paymentStatus: transfer.payment_status || 'pending',
      clientId: transfer.client_id || '',
      // Manually attach client data if it exists
      client: transfer.client_id && clientsMap[transfer.client_id] ? {
        id: clientsMap[transfer.client_id].id,
        name: clientsMap[transfer.client_id].name,
        email: clientsMap[transfer.client_id].email
      } : undefined,
      expenses: (transfer.expenses || []).map((expense: any) => ({
        id: expense.id,
        transferId: transfer.id,
        date: expense.date,
        concept: capitalizeFirstLetter(expense.concept),
        amount: Number(expense.amount)
      })),
      extraCharges: (extraChargesMap[transfer.id] || []).map((charge: any) => ({
        id: charge.id,
        transferId: transfer.id,
        name: capitalizeFirstLetter(charge.name),
        price: Number(charge.price)
      }))
    }));
  } catch (error: any) {
    console.error('Error fetching transfers:', error);
    toast.error(`Error al cargar los transfers: ${error.message}`);
    return [];
  }
}
