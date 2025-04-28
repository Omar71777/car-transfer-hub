
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client, CreateClientDto } from '@/types/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useClients() {
  const queryClient = useQueryClient();

  // Use React Query for fetching clients
  const { 
    data: clients = [], 
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('Fetching clients from database');
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) {
        console.error('Database error fetching clients:', error.message);
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} clients`);
      return data || [];
    }
  });

  const getClient = useCallback(async (id: string) => {
    if (!id) {
      console.warn('getClient called without id parameter');
      return null;
    }
    
    try {
      // First check if we already have the client in the cache
      const cachedClients = queryClient.getQueryData<Client[]>(['clients']);
      const cachedClient = cachedClients?.find(c => c.id === id);
      
      if (cachedClient) {
        console.log('Client found in cache:', id);
        return cachedClient;
      }
      
      console.log('Fetching client from database:', id);
      // If not, fetch from database
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching client:', error.message);
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error in getClient:', error.message);
      toast.error(`Error al cargar el cliente: ${error.message}`);
      return null;
    }
  }, [queryClient]);

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (clientData: CreateClientDto): Promise<Client | null> => {
      console.log('Creating new client:', clientData.name);
      try {
        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('Authentication error: No user found');
          throw new Error('User must be authenticated to create a client');
        }

        const { data, error } = await supabase
          .from('clients')
          .insert({
            ...clientData,
            user_id: user.id
          })
          .select()
          .single();

        if (error) {
          console.error('Database error creating client:', error.message);
          throw error;
        }

        console.log('Client created successfully:', data.id);
        return data;
      } catch (error: any) {
        console.error('Error creating client:', error.message);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch clients query when client is created
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  const createClient = async (clientData: CreateClientDto): Promise<Client | null> => {
    try {
      const newClient = await createClientMutation.mutateAsync(clientData);
      return newClient;
    } catch (error: any) {
      toast.error(`Error al crear el cliente: ${error.message}`);
      return null;
    }
  };

  // Update and delete mutations similar to create
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

      // Update the cache
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      return data;
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error(`Error al actualizar el cliente: ${error.message}`);
      return null;
    }
  }, [queryClient]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update the cache
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      return true;
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error(`Error al eliminar el cliente: ${error.message}`);
      return false;
    }
  }, [queryClient]);

  // Manual fetch function that returns the fetched clients
  const fetchClients = useCallback(async () => {
    console.log('Manual client fetch requested');
    const result = await refetch();
    
    if (result.error) {
      console.error('Error in manual client fetch:', result.error);
      return [];
    }
    
    return result.data || [];
  }, [refetch]);

  return {
    clients,
    loading,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    isCreatingClient: createClientMutation.isPending
  };
}
