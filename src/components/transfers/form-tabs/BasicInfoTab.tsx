
import React from 'react';
import { DateTimeFields } from '../form-fields/DateTimeFields';
import { PaymentStatusField } from '../form-fields/PaymentStatusField';
import { ClientSelect } from '@/components/clients/ClientSelect';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Client } from '@/types/client';
import { ClientField } from '../form-fields/client-field';

interface BasicInfoTabProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
  clients: Client[];
  onClientCreated?: () => Promise<void>;
  isClientsLoading?: boolean;
}

export function BasicInfoTab({ 
  form, 
  serviceType, 
  clients,
  onClientCreated,
  isClientsLoading = false 
}: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Información básica</h3>
      <DateTimeFields form={form} />
      <ClientField 
        form={form} 
        clients={clients} 
        onClientCreated={onClientCreated}
        isClientsLoading={isClientsLoading}
      />
      <PaymentStatusField />
    </div>
  );
}
