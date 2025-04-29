
import { useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../../../schema/transferSchema';
import { useClientCreation } from '@/hooks/useClientCreation';
import { Client } from '@/types/client';

interface UseClientSelectionProps {
  form: UseFormReturn<TransferFormValues>;
  clients: Client[];
  onClientCreated?: () => Promise<void>;
}

export function useClientSelection({ 
  form, 
  clients, 
  onClientCreated 
}: UseClientSelectionProps) {
  const {
    isNewClientDialogOpen,
    setIsNewClientDialogOpen,
    clientNameValue,
    setClientNameValue,
    clientEmailValue,
    setClientEmailValue,
    isCreatingClient,
    createError,
    handleAddNewClient,
    handleNewClientSubmit,
    closeDialog,
    dialogStatus
  } = useClientCreation({ 
    form, 
    onSuccess: onClientCreated
  });

  const isSelectDisabled = isCreatingClient;

  // Memorize clients to prevent unnecessary re-renders
  const clientOptions = useMemo(() => clients, [clients]);
  
  const openNewClientDialog = useCallback(() => {
    handleAddNewClient();
  }, [handleAddNewClient]);

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
    isCreatingClient,
    isSelectDisabled,
    dialogStatus,
    
    // Error handling
    createError,
    
    // Actions
    handleAddNewClient: openNewClientDialog,
    handleNewClientSubmit,
    closeDialog,
    
    // Data
    clientOptions
  };
}
