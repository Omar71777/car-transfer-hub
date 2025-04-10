
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transfer } from '@/types';
import { capitalizeFirstLetter } from '@/lib/utils';

export function useFetchTransfers(user: any) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Remove the clients relationship which was causing the error
      const { data, error } = await supabase
        .from('transfers')
        .select(`
          id,
          date,
          time,
          origin,
          destination,
          price,
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

      // Create a map of clients for easy lookup
      const clientsMap = (clientsData || []).reduce((acc, client) => {
        acc[client.id] = client;
        return acc;
      }, {});

      const transformedData = data.map((transfer: any) => ({
        id: transfer.id,
        date: transfer.date,
        time: transfer.time || '',
        origin: capitalizeFirstLetter(transfer.origin),
        destination: capitalizeFirstLetter(transfer.destination),
        price: Number(transfer.price),
        collaborator: transfer.collaborator && transfer.collaborator !== 'none' ? capitalizeFirstLetter(transfer.collaborator) : '',
        commission: Number(transfer.commission),
        commissionType: transfer.commission_type || 'percentage',
        paymentStatus: transfer.payment_status || 'pending',
        clientId: transfer.client_id || '',
        // Manually attach client data if it exists
        client: transfer.client_id && clientsMap[transfer.client_id] ? {
          id: clientsMap[transfer.client_id].id,
          name: clientsMap[transfer.client_id].name,
          email: clientsMap[transfer.client_id].email
        } : undefined,
        expenses: transfer.expenses.map((expense: any) => ({
          id: expense.id,
          transferId: transfer.id,
          date: expense.date,
          concept: capitalizeFirstLetter(expense.concept),
          amount: Number(expense.amount)
        }))
      }));

      setTransfers(transformedData);
    } catch (error: any) {
      console.error('Error fetching transfers:', error);
      toast.error(`Error al cargar los transfers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { transfers, loading, fetchTransfers, setTransfers };
}
