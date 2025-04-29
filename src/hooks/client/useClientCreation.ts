
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useClientVerification } from './useClientVerification';
import { useClientSubmission } from './useClientSubmission';
import { useClientDialog } from './useClientDialog';
import { useClients } from '../useClients';

interface UseClientCreationProps {
  form?: UseFormReturn<any>;
  onSuccess?: () => Promise<void>;
}

export function useClientCreation({ form, onSuccess }: UseClientCreationProps = {}) {
  const { isCreatingClient } = useClients();
  
  const {
    isVerifyingClient,
    setIsVerifyingClient,
    newClientId,
    setNewClientId,
    retryCount,
    setRetryCount,
    verifyClientCreation
  } = useClientVerification({ form, onSuccess });

  const {
    clientNameValue,
    setClientNameValue,
    clientEmailValue,
    setClientEmailValue,
    createError,
    setCreateError,
    handleNewClientSubmit
  } = useClientSubmission({
    verifyClientCreation,
    setNewClientId,
    onSuccess
  });

  const {
    isNewClientDialogOpen,
    setIsNewClientDialogOpen,
    handleAddNewClient,
    closeDialog,
    dialogStatus
  } = useClientDialog({
    isCreatingClient,
    isVerifyingClient
  });
  
  // Reset all state when adding a new client
  const handleAddNewClientWithReset = useCallback(() => {
    setCreateError(null);
    setClientNameValue('');
    setClientEmailValue('');
    handleAddNewClient();
  }, [handleAddNewClient, setCreateError, setClientNameValue, setClientEmailValue]);

  return {
    // Dialog state
    isNewClientDialogOpen,
    setIsNewClientDialogOpen,
    
    // Client form values
    clientNameValue,
    setClientNameValue,
    clientEmailValue,
    setClientEmailValue,
    
    // Status flags
    isCreatingClient: isCreatingClient || isVerifyingClient,
    createError,
    newClientId,
    
    // Actions
    handleAddNewClient: handleAddNewClientWithReset,
    handleNewClientSubmit,
    closeDialog,
    
    // Status
    dialogStatus
  };
}
