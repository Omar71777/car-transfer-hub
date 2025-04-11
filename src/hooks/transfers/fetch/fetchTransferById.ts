
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '@/lib/utils';

export async function fetchTransferById(id: string) {
  if (!id) return null;
  
  try {
    // Fetch the transfer
    const { data: transfer, error } = await supabase
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
        client_id
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Fetch client data
    let client = null;
    if (transfer.client_id) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('id', transfer.client_id)
        .maybeSingle();

      if (!clientError && clientData) {
        client = clientData;
      }
    }

    // Fetch expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, date, concept, amount')
      .eq('transfer_id', id);

    if (expensesError) {
      console.error('Error fetching expenses:', expensesError);
    }

    // Fetch extra charges
    const { data: extraCharges, error: extraChargesError } = await supabase
      .from('extra_charges')
      .select('id, name, price')
      .eq('transfer_id', id);

    if (extraChargesError) {
      console.error('Error fetching extra charges:', extraChargesError);
    }

    // Ensure the service_type is properly typed as 'transfer' | 'dispo'
    const serviceType = transfer.service_type === 'dispo' ? 'dispo' : 'transfer';

    return {
      id: transfer.id,
      date: transfer.date,
      time: transfer.time || '',
      serviceType: serviceType as 'transfer' | 'dispo',
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
      client: client ? {
        id: client.id,
        name: client.name,
        email: client.email
      } : undefined,
      expenses: (expenses || []).map((expense) => ({
        id: expense.id,
        transferId: id,
        date: expense.date,
        concept: capitalizeFirstLetter(expense.concept),
        amount: Number(expense.amount)
      })),
      extraCharges: (extraCharges || []).map((charge) => ({
        id: charge.id,
        transferId: id,
        name: capitalizeFirstLetter(charge.name),
        price: Number(charge.price)
      }))
    };
  } catch (error: any) {
    console.error('Error fetching transfer by ID:', error);
    toast.error(`Error al cargar el transfer: ${error.message}`);
    return null;
  }
}
