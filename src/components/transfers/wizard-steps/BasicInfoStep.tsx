
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ClientStep } from './ClientStep';
import { DateTimeStep } from './DateTimeStep';
import { LocationStep } from './LocationStep';
import { Client } from '@/types/client';

interface BasicInfoStepProps {
  clients: Client[];
  collaborators: any[];
  formState: any;
}

export function BasicInfoStep({ clients, formState, collaborators }: BasicInfoStepProps) {
  const { control, register, watch, formState: { errors } } = useFormContext();
  const serviceType = watch('serviceType');
  
  return (
    <div className="space-y-6">
      <ClientStep clients={clients} collaborators={collaborators} formState={formState} />
      <DateTimeStep clients={clients} collaborators={collaborators} formState={formState} />
      <LocationStep clients={clients} collaborators={collaborators} formState={formState} serviceType={serviceType} />
    </div>
  );
}
