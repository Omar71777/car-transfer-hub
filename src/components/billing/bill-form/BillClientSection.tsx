
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Client } from '@/types/client';
import { ClientField } from '@/components/transfers/form-fields/client-field';
import { useQueryClient } from '@tanstack/react-query';

// Define the schema type using the parent schema
interface BillClientSectionProps {
  form: UseFormReturn<any>;
  clients: Client[];
  onClientChange: (clientId: string) => void;
  loadingClients?: boolean;
}

export function BillClientSection({ form, clients, onClientChange, loadingClients = false }: BillClientSectionProps) {
  const queryClient = useQueryClient();
  
  const handleClientCreated = async () => {
    // Invalidate and refresh clients query
    await queryClient.invalidateQueries({ queryKey: ['clients'] });
  };
  
  return (
    <ClientField
      form={form}
      clients={clients}
      onClientCreated={handleClientCreated}
      isClientsLoading={loadingClients}
    />
  );
}
