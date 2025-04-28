
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Transfer } from '@/types';

export async function fetchAllTransfers(user: any) {
  if (!user) return [];
  
  try {
    console.log('Fetching transfers for user:', user.id);
    
    // Fetch transfers with all required fields
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
        payment_method,
        billed,
        client_id,
        hours,
        expenses (
          id,
          date,
          concept,
          amount
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transfers:', error);
      throw error;
    }

    console.log('Fetched transfers:', data ? data.length : 0);

    // Get all clients to manually join with transfers
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, email');

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
    } else {
      console.log('Fetched clients:', clientsData ? clientsData.length : 0);
    }

    // Fetch extra charges for all transfers
    const transferIds = data.map((transfer: any) => transfer.id);
    let extraChargesMap: Record<string, any[]> = {};
    
    if (transferIds.length > 0) {
      const { data: allExtraCharges, error: extraChargesError } = await supabase
        .from('extra_charges')
        .select('*')
        .in('transfer_id', transferIds);
      
      if (extraChargesError) {
        console.error('Error fetching extra charges:', extraChargesError);
      }
        
      // Group extra charges by transfer ID for easy lookup
      if (allExtraCharges) {
        console.log('Fetched extra charges:', allExtraCharges.length);
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

    // Map transfers with all related data
    const processedTransfers = data.map((transfer: any) => {
      // Handle potential undefined values
      const serviceType = transfer.service_type === 'dispo' ? 'dispo' : 'transfer';
      const origin = transfer.origin ? capitalizeFirstLetter(transfer.origin) : '';
      const destination = transfer.destination ? capitalizeFirstLetter(transfer.destination) : '';
      const collaborator = transfer.collaborator && transfer.collaborator !== 'none' ? 
        capitalizeFirstLetter(transfer.collaborator) : '';
      
      // Format expenses
      const expenses = (transfer.expenses || []).map((expense: any) => ({
        id: expense.id,
        transferId: transfer.id,
        date: expense.date,
        concept: capitalizeFirstLetter(expense.concept),
        amount: Number(expense.amount)
      }));
      
      // Format extra charges
      const extraCharges = (extraChargesMap[transfer.id] || []).map((charge: any) => ({
        id: charge.id,
        transferId: transfer.id,
        name: capitalizeFirstLetter(charge.name),
        price: Number(charge.price)
      }));
      
      // Format client data
      const client = transfer.client_id && clientsMap[transfer.client_id] ? {
        id: clientsMap[transfer.client_id].id,
        name: clientsMap[transfer.client_id].name,
        email: clientsMap[transfer.client_id].email
      } : undefined;
      
      // Return formatted transfer with explicit type casting for serviceType
      return {
        id: transfer.id,
        date: transfer.date,
        time: transfer.time || '',
        serviceType: serviceType as 'transfer' | 'dispo',
        origin,
        destination,
        hours: transfer.hours || undefined,
        price: Number(transfer.price),
        discountType: transfer.discount_type,
        discountValue: Number(transfer.discount_value) || 0,
        collaborator,
        commission: Number(transfer.commission) || 0,
        commissionType: transfer.commission_type || 'percentage',
        paymentStatus: transfer.payment_status || 'pending',
        payment_method: transfer.payment_method || null,
        billed: transfer.billed || false,
        clientId: transfer.client_id || '',
        client,
        expenses,
        extraCharges
      };
    });

    console.log('Processed transfers:', processedTransfers.length);
    return processedTransfers as Transfer[];
  } catch (error: any) {
    console.error('Error processing transfers:', error);
    toast.error(`Error al cargar los transfers: ${error.message}`);
    return [];
  }
}
