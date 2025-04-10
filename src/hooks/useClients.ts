
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client, CreateClientDto, UpdateClientDto } from '@/types/client';
import { toast } from 'sonner';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setClients(data as Client[]);
      setLoading(false);
    } catch (error: any) {
      toast.error(`Error al cargar clientes: ${error.message}`);
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  }, []);

  const getClient = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data as Client;
    } catch (error: any) {
      toast.error(`Error al obtener cliente: ${error.message}`);
      console.error('Error fetching client:', error);
      return null;
    }
  }, []);

  const createClient = useCallback(async (clientData: CreateClientDto) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Cliente creado con éxito');
      return data.id;
    } catch (error: any) {
      toast.error(`Error al crear cliente: ${error.message}`);
      console.error('Error creating client:', error);
      return null;
    }
  }, []);

  const updateClient = useCallback(async (id: string, clientData: UpdateClientDto) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Cliente actualizado con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al actualizar cliente: ${error.message}`);
      console.error('Error updating client:', error);
      return false;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      // Verificar si el cliente tiene facturas
      const { data: bills, error: billsError } = await supabase
        .from('bills')
        .select('id')
        .eq('client_id', id);

      if (billsError) throw billsError;
      
      if (bills && bills.length > 0) {
        toast.error('No se puede eliminar un cliente con facturas asociadas');
        return false;
      }
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Cliente eliminado con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al eliminar cliente: ${error.message}`);
      console.error('Error deleting client:', error);
      return false;
    }
  }, []);

  return {
    clients,
    loading,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
  };
}
