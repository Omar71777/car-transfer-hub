
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateClientDto } from '@/types/client';
import { useClients } from '../useClients';

interface UseClientSubmissionProps {
  verifyClientCreation: (clientId: string) => void;
  setNewClientId: (id: string | null) => void;
  onSuccess?: () => Promise<void>;
}

export function useClientSubmission({ 
  verifyClientCreation,
  setNewClientId,
  onSuccess
}: UseClientSubmissionProps) {
  const [clientNameValue, setClientNameValue] = useState('');
  const [clientEmailValue, setClientEmailValue] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { createClient, isCreatingClient } = useClients();

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
  }, [clientNameValue, clientEmailValue, createClient, queryClient, onSuccess, setNewClientId, verifyClientCreation]);

  return {
    clientNameValue,
    setClientNameValue,
    clientEmailValue,
    setClientEmailValue,
    createError,
    setCreateError,
    handleNewClientSubmit
  };
}
