
import React from 'react';
import { LocationFields } from '../form-fields/LocationFields';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';

interface LocationTabProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
}

export function LocationTab({ form, serviceType }: LocationTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Ubicación</h3>
      <LocationFields form={form} serviceType={serviceType} />
    </div>
  );
}
