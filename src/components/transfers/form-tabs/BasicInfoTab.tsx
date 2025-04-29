
import React from 'react';
import { ClientField } from '../form-fields/client-field';
import { DateTimeFields } from '../form-fields/DateTimeFields';
import { LocationFields } from '../form-fields/LocationFields';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Client } from '@/types/client';

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
    <div className="space-y-6">
      <ClientField 
        form={form} 
        clients={clients}
        onClientCreated={onClientCreated}
        isClientsLoading={isClientsLoading}
      />
      <DateTimeFields form={form} />
      <LocationFields form={form} serviceType={serviceType} />
    </div>
  );
}
