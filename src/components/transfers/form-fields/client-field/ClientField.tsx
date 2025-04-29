
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../../schema/transferSchema';
import { Client } from '@/types/client';
import { ClientSelectField } from './components/ClientSelectField';
import { CreateClientDialog } from './components/CreateClientDialog';
import { useClientSelection } from './hooks/useClientSelection';

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
    isSelectDisabled,
    createError,
    handleAddNewClient,
    handleNewClientSubmit,
    closeDialog,
    dialogStatus
  } = useClientSelection({ 
    form, 
    clients,
    onClientCreated
  });

  return (
    <>
      <ClientSelectField
        form={form}
        clients={clients}
        isLoading={isClientsLoading}
        isSelectDisabled={isSelectDisabled}
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
        dialogStatus={dialogStatus}
      />
    </>
  );
}
