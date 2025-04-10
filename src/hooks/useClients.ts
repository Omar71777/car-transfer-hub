
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
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast.error(`Error fetching clients: ${error.message}`);
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getClient = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error(`Error fetching client: ${error.message}`);
      console.error('Error fetching client:', error);
      return null;
    }
  }, []);

  const createClient = useCallback(async (clientData: CreateClientDto) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error: any) {
      toast.error(`Error creating client: ${error.message}`);
      console.error('Error creating client:', error);
      return null;
    }
  }, []);

  const updateClient = useCallback(async (id: string, clientData: UpdateClientDto) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          ...clientData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Error updating client: ${error.message}`);
      console.error('Error updating client:', error);
      return false;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Error deleting client: ${error.message}`);
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
