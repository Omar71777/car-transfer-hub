
import React from 'react';
import { PricingFields } from '../form-fields/PricingFields';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';

interface PricingTabProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
}

export function PricingTab({ form, serviceType }: PricingTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Precio y descuentos</h3>
      <PricingFields serviceType={serviceType} />
    </div>
  );
}
