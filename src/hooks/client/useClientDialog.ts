
import { useState, useCallback } from 'react';

interface UseClientDialogProps {
  isCreatingClient: boolean;
  isVerifyingClient: boolean;
}

export function useClientDialog({
  isCreatingClient,
  isVerifyingClient
}: UseClientDialogProps) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  
  // Calculate dialog status based on current state
  const dialogStatus = isVerifyingClient ? 'verifying' : isCreatingClient ? 'creating' : 'idle';
  
  // Handle opening the new client dialog
  const handleAddNewClient = useCallback(() => {
    setIsNewClientDialogOpen(true);
  }, []);
  
  // Handle closing the dialog
  const closeDialog = useCallback(() => {
    if (!isCreatingClient && !isVerifyingClient) {
      setIsNewClientDialogOpen(false);
    }
  }, [isCreatingClient, isVerifyingClient]);

  return {
    isNewClientDialogOpen,
    setIsNewClientDialogOpen,
    handleAddNewClient,
    closeDialog,
    dialogStatus
  };
}
