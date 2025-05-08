
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PricingFields } from '../form-fields/PricingFields';
import { PaymentStatusField } from '../form-fields/PaymentStatusField';

interface PricingStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function PricingStep({ formState }: PricingStepProps) {
  const form = useFormContext();
  const serviceType = form.watch('serviceType');
  
  return (
    <div className="space-y-6">
      <PricingFields serviceType={serviceType} />
      <div className="mt-4">
        <PaymentStatusField form={form} />
      </div>
    </div>
  );
}
