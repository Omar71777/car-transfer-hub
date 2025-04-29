
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Client, CreateClientDto } from '@/types/client';
import { useClients } from './useClients';
import { UseFormReturn } from 'react-hook-form';

interface UseClientCreationProps {
  form?: UseFormReturn<any>;
  onSuccess?: () => Promise<void>;
}

export function useClientCreation({ form, onSuccess }: UseClientCreationProps = {}) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [clientNameValue, setClientNameValue] = useState('');
  const [clientEmailValue, setClientEmailValue] = useState('');
  const [isVerifyingClient, setIsVerifyingClient] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [newClientId, setNewClientId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { createClient, isCreatingClient, clients } = useClients();

  const handleAddNewClient = useCallback(() => {
    setCreateError(null);
    setClientNameValue('');
    setClientEmailValue('');
    setIsNewClientDialogOpen(true);
  }, []);

  const handleNewClientSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!clientNameValue) {
      setCreateError('El nombre del cliente es requerido');
      return null;
    }

    try {
      setCreateError(null);
      console.log('Creating client:', clientNameValue);
      
      const newClientData: CreateClientDto = {
        name: clientNameValue,
        email: clientEmailValue || `${clientNameValue.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      };
      
      // Create the client
      const newClient = await createClient(newClientData);
      
      if (newClient) {
        console.log('Client created successfully with ID:', newClient.id);
        
        // Clear form values
        setClientNameValue('');
        setClientEmailValue('');
        
        // Store the new client ID for verification
        setNewClientId(newClient.id);
        
        // Invalidate queries to refresh client list
        await queryClient.invalidateQueries({ queryKey: ['clients'] });
        
        // If there's an additional refresh function, call it
        if (onSuccess) {
          console.log('Refreshing client list via onSuccess callback');
          await onSuccess();
        }
        
        // Start verification process
        verifyClientCreation(newClient.id);
        
        // Return the new client
        return newClient;
      }
      
      throw new Error('Failed to create client');
    } catch (error: any) {
      console.error('Error creating client:', error);
      setCreateError(error.message || 'Error al crear el cliente');
      toast.error('Error al crear el cliente');
      return null;
    }
  }, [clientNameValue, clientEmailValue, createClient, queryClient, onSuccess]);
  
  const verifyClientCreation = useCallback((clientId: string) => {
    setIsVerifyingClient(true);
    setRetryCount(0);
    
    // Function to check if the client exists in the list
    const checkClientExists = async () => {
      console.log(`Verifying client existence (attempt ${retryCount + 1})...`);
      
      // Get the latest clients from the cache
      const cachedClients = queryClient.getQueryData<Client[]>(['clients']) || [];
      const clientExists = cachedClients.some(c => c.id === clientId);
      
      if (clientExists) {
        console.log('Client found in list, updating form value');
        if (form) {
          form.setValue('clientId', clientId, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
        }
        
        // Reset states
        setNewClientId(null);
        setIsVerifyingClient(false);
        setRetryCount(0);
        toast.success('Cliente creado exitosamente');
        setIsNewClientDialogOpen(false);
        
        return true;
      } else if (retryCount < 3) {
        console.log(`Client not found in list, retrying (${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        
        // Invalidate and refetch clients again
        await queryClient.invalidateQueries({ queryKey: ['clients'] });
        
        if (onSuccess) {
          try {
            await onSuccess();
          } catch (error) {
            console.error('Error refreshing client list:', error);
          }
        }
        
        // Try again after a delay
        setTimeout(checkClientExists, 500);
        return false;
      } else {
        console.error('Maximum retry attempts reached, client not found');
        setCreateError('Cliente creado pero no aparece en la lista. Por favor, inténtelo de nuevo.');
        setIsVerifyingClient(false);
        setRetryCount(0);
        
        // Even though verification failed, still use the ID if we have a form
        if (form) {
          form.setValue('clientId', clientId, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
        }
        
        return false;
      }
    };
    
    // Start the verification process
    checkClientExists();
  }, [queryClient, retryCount, form, onSuccess]);
  
  const closeDialog = useCallback(() => {
    // Only allow closing if not in the middle of an operation
    if (!isCreatingClient && !isVerifyingClient) {
      setIsNewClientDialogOpen(false);
      setCreateError(null);
      setNewClientId(null);
      setRetryCount(0);
      setIsVerifyingClient(false);
    } else {
      // Show message that operation is in progress
      toast.info('Por favor espere a que se complete la operación');
    }
  }, [isCreatingClient, isVerifyingClient]);

  return {
    isNewClientDialogOpen,
    setIsNewClientDialogOpen,
    clientNameValue,
    setClientNameValue,
    clientEmailValue,
    setClientEmailValue,
    isCreatingClient: isCreatingClient || isVerifyingClient,
    createError,
    newClientId,
    handleAddNewClient,
    handleNewClientSubmit,
    closeDialog,
    dialogStatus: isCreatingClient ? 'creating' : isVerifyingClient ? 'verifying' : 'idle'
  };
}
