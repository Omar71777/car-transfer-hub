
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
import { toast } from 'sonner';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setClients(data || []);
      return data;
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error(`Error al cargar los clientes: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const getClient = useCallback(async (id: string) => {
    try {
      // First check if we already have the client in state
      const cachedClient = clients.find(c => c.id === id);
      if (cachedClient) return cachedClient;
      
      // If not, fetch from database
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching client:', error);
      toast.error(`Error al cargar el cliente: ${error.message}`);
      return null;
    }
  }, [clients]);

  const createClient = useCallback(async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'> | CreateClientDto) => {
    try {
      // Ensure we have all the required fields with the user_id from auth
      const client = {
        ...clientData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setClients(prev => [...prev, data]);
      return data;
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(`Error al crear el cliente: ${error.message}`);
      return null;
    }
  }, []);

  const updateClient = useCallback(async (id: string, client: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setClients(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error(`Error al actualizar el cliente: ${error.message}`);
      return null;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setClients(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error(`Error al eliminar el cliente: ${error.message}`);
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
    deleteClient
  };
}
