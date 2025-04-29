
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Client } from '@/types/client';
import { UseFormReturn } from 'react-hook-form';

interface UseClientVerificationProps {
  form?: UseFormReturn<any>;
  onSuccess?: () => Promise<void>;
  closeDialog?: () => void; // New prop to close dialog
}

export function useClientVerification({ 
  form, 
  onSuccess,
  closeDialog 
}: UseClientVerificationProps = {}) {
  const [isVerifyingClient, setIsVerifyingClient] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [newClientId, setNewClientId] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
        
        // Close dialog after successful verification
        if (closeDialog) {
          closeDialog();
        }
        
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
        
        // Close dialog even if verification failed but client ID was set
        if (closeDialog) {
          closeDialog();
        }
        
        return false;
      }
    };
    
    // Start the verification process
    checkClientExists();
  }, [queryClient, retryCount, form, onSuccess, closeDialog]);

  return {
    isVerifyingClient,
    setIsVerifyingClient,
    newClientId,
    setNewClientId,
    retryCount,
    setRetryCount,
    verifyClientCreation
  };
}
