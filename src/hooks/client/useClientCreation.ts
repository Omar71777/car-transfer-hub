
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
  
  // Create a dialog hook instance
  const {
    isNewClientDialogOpen,
    setIsNewClientDialogOpen,
    handleAddNewClient,
    closeDialog,
    dialogStatus
  } = useClientDialog({
    isCreatingClient: false, // We'll update this with the combined state
    isVerifyingClient: false // We'll update this with the combined state
  });
  
  // Create a client verification hook instance with the closeDialog function
  const {
    isVerifyingClient,
    setIsVerifyingClient,
    newClientId,
    setNewClientId,
    retryCount,
    setRetryCount,
    verifyClientCreation
  } = useClientVerification({ 
    form, 
    onSuccess,
    closeDialog // Pass the closeDialog function
  });

  // Create a client submission hook instance
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
  
  // Update the dialog hooks with the actual state values
  const updatedDialogHooks = useClientDialog({
    isCreatingClient: isCreatingClient || false,
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
    setIsNewClientDialogOpen: updatedDialogHooks.setIsNewClientDialogOpen,
    
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
    closeDialog: updatedDialogHooks.closeDialog,
    
    // Status
    dialogStatus: updatedDialogHooks.dialogStatus
  };
}
