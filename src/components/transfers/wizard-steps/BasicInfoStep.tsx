
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ClientStep } from './ClientStep';
import { DateTimeStep } from './DateTimeStep';
import { LocationStep } from './LocationStep';

interface BasicInfoStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function BasicInfoStep({ clients, formState }: BasicInfoStepProps) {
  const { control, register, watch, formState: { errors } } = useFormContext();
  const serviceType = watch('serviceType');
  
  return (
    <div className="space-y-6">
      <ClientStep clients={clients} />
      <DateTimeStep />
      <LocationStep serviceType={serviceType} />
    </div>
  );
}
