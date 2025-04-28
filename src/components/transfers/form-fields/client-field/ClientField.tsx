
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../../schema/transferSchema';
import { Client, CreateClientDto } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';
import { ClientSelect } from './ClientSelect';
import { CreateClientDialog } from './CreateClientDialog';

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
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [clientNameValue, setClientNameValue] = useState('');
  const [clientEmailValue, setClientEmailValue] = useState('');
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  const { createClient } = useClients();

  const handleAddNewClient = () => {
    setCreateError(null);
    setClientNameValue('');
    setClientEmailValue('');
    setIsNewClientDialogOpen(true);
  };

  const handleNewClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientNameValue) {
      setCreateError('El nombre del cliente es requerido');
      return;
    }

    try {
      setIsCreatingClient(true);
      setCreateError(null);
      console.log('Creating client:', clientNameValue);
      
      const newClientData: CreateClientDto = {
        name: clientNameValue,
        email: clientEmailValue || `${clientNameValue.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      };
      
      const newClient = await createClient(newClientData);
      
      if (newClient) {
        console.log('Client created successfully with ID:', newClient.id);
        
        // Clear form values
        setClientNameValue('');
        setClientEmailValue('');
        
        // Update client list
        if (onClientCreated) {
          console.log('Refreshing client list...');
          await onClientCreated();
          console.log('Client list refreshed');
        }
        
        // Verify the client exists in the updated list
        const clientExists = clients.some(c => c.id === newClient.id);
        if (!clientExists) {
          console.log('New client not found in list, retrying refresh...');
          if (onClientCreated) {
            await onClientCreated();
          }
        }
        
        // Update form with new client ID
        console.log('Setting form value to new client ID:', newClient.id);
        form.setValue('clientId', newClient.id, { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
        
        toast.success('Cliente creado exitosamente');
        setIsNewClientDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error creating client:', error);
      setCreateError(error.message || 'Error al crear el cliente');
      toast.error('Error al crear el cliente');
    } finally {
      setIsCreatingClient(false);
    }
  };

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
        onOpenChange={(open) => {
          if (!isCreatingClient) {
            setIsNewClientDialogOpen(open);
            if (!open) {
              setCreateError(null);
            }
          }
        }}
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
