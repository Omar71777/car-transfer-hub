
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../../schema/transferSchema';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import { ClientSelect } from './ClientSelect';
import { CreateClientDialog } from './CreateClientDialog';
import { useClientCreation } from '@/hooks/useClientCreation';

interface ClientFieldProps {
  form: UseFormReturn<TransferFormValues>;
  clients: Client[];
  onClientCreated?: () => Promise<void>;
  isClientsLoading?: boolean;
}

export function ClientField({ 
  form, 
  clients, 
  onClientCreated, 
  isClientsLoading = false 
}: ClientFieldProps) {
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
    closeDialog
  } = useClientCreation({ 
    form, 
    onSuccess: onClientCreated
  });

  return (
    <>
      <ClientSelect
        form={form}
        clients={clients}
        isLoading={isClientsLoading}
        isCreating={isCreatingClient}
        onAddNew={handleAddNewClient}
      />
      
      <CreateClientDialog
        isOpen={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onSubmit={handleNewClientSubmit}
        clientName={clientNameValue}
        onClientNameChange={setClientNameValue}
        clientEmail={clientEmailValue}
        onClientEmailChange={setClientEmailValue}
        isCreating={isCreatingClient}
        error={createError}
      />
    </>
  );
}
