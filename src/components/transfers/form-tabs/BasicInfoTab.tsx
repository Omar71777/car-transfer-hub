
import React from 'react';
import { DateTimeFields } from '../form-fields/DateTimeFields';
import { LocationFields } from '../form-fields/LocationFields';
import { PaymentStatusField } from '../form-fields/PaymentStatusField';
import { ClientSelect } from '@/components/clients/ClientSelect';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Client } from '@/types/client';

interface BasicInfoTabProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
  clients: Client[];
}

export function BasicInfoTab({ form, serviceType, clients }: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Información básica</h3>
      <DateTimeFields form={form} />
      <ClientSelect 
        control={form.control} 
        clients={clients} 
        label="Cliente *"
      />
      <PaymentStatusField />
    </div>
  );
}
