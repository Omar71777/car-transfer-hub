
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

  // Create client mutation with optimistic updates
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
    // Add optimistic update
    onMutate: async (newClient) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      
      // Snapshot the previous clients
      const previousClients = queryClient.getQueryData<Client[]>(['clients']) || [];
      
      // Optimistically update the cache with the new client
      // We need to generate a temporary ID
      const tempId = `temp-${Date.now()}`;
      const optimisticClient: Client = {
        id: tempId,
        name: newClient.name,
        email: newClient.email || `${newClient.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        user_id: 'temp', // Will be replaced by the actual value
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      queryClient.setQueryData<Client[]>(['clients'], old => 
        [...(old || []), optimisticClient]
      );
      
      return { previousClients };
    },
    onError: (error, variables, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData<Client[]>(['clients'], context.previousClients);
      }
      console.error('Error creating client:', error);
    },
    onSettled: () => {
      // Always refetch after error or success to make sure we're up to date
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

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, client }: { id: string, client: Partial<Client> }) => {
      console.log('Updating client:', id);
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error.message);
        throw error;
      }

      return data;
    },
    onSuccess: (updated) => {
      // Update the cache with the updated client
      queryClient.setQueryData<Client[]>(['clients'], old => 
        old?.map(client => client.id === updated.id ? updated : client) || []
      );
      
      toast.success('Cliente actualizado con éxito');
    }
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting client:', id);
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error.message);
        throw error;
      }
      
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove the client from the cache
      queryClient.setQueryData<Client[]>(['clients'], old => 
        old?.filter(client => client.id !== deletedId) || []
      );
      
      toast.success('Cliente eliminado con éxito');
    }
  });

  const updateClient = useCallback(async (id: string, client: Partial<Client>) => {
    try {
      return await updateClientMutation.mutateAsync({ id, client });
    } catch (error: any) {
      toast.error(`Error al actualizar el cliente: ${error.message}`);
      return null;
    }
  }, [updateClientMutation]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      await deleteClientMutation.mutateAsync(id);
      return true;
    } catch (error: any) {
      toast.error(`Error al eliminar el cliente: ${error.message}`);
      return false;
    }
  }, [deleteClientMutation]);

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
