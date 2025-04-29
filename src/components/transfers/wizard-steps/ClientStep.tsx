
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Client } from '@/types/client';
import { UserCircle } from 'lucide-react';
import { ClientField } from '@/components/transfers/form-fields/client-field';
import { useQueryClient } from '@tanstack/react-query';

interface ClientStepProps {
  clients: Client[];
  collaborators: any;
  formState: any;
}

export function ClientStep({ clients, collaborators, formState }: ClientStepProps) {
  const form = useFormContext();
  const queryClient = useQueryClient();
  
  const handleClientCreated = useCallback(async () => {
    // Invalidate and refresh clients query
    await queryClient.invalidateQueries({ queryKey: ['clients'] });
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <UserCircle className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">¿Quién es el cliente de este transfer?</h2>
        <p className="text-muted-foreground mt-1">
          Selecciona un cliente de la lista o crea uno nuevo
        </p>
      </div>

      <ClientField
        form={form}
        clients={clients}
        onClientCreated={handleClientCreated}
        isClientsLoading={false}
      />
    </div>
  );
}
