
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseClientDialogProps {
  isCreatingClient: boolean;
  isVerifyingClient: boolean;
}

export function useClientDialog({ isCreatingClient, isVerifyingClient }: UseClientDialogProps) {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  const handleAddNewClient = useCallback(() => {
    setIsNewClientDialogOpen(true);
  }, []);
  
  const closeDialog = useCallback(() => {
    // Only allow closing if not in the middle of an operation
    if (!isCreatingClient && !isVerifyingClient) {
      setIsNewClientDialogOpen(false);
    } else {
      // Show message that operation is in progress
      toast.info('Por favor espere a que se complete la operación');
    }
  }, [isCreatingClient, isVerifyingClient]);

  const getDialogStatus = useCallback((): "idle" | "creating" | "verifying" => {
    if (isCreatingClient) return "creating";
    if (isVerifyingClient) return "verifying";
    return "idle";
  }, [isCreatingClient, isVerifyingClient]);

  return {
    isNewClientDialogOpen,
    setIsNewClientDialogOpen,
    handleAddNewClient,
    closeDialog,
    dialogStatus: getDialogStatus()
  };
}
