
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ConfirmationScreen } from './confirmation/ConfirmationScreen';

interface ConfirmationStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function ConfirmationStep({ clients, collaborators, formState }: ConfirmationStepProps) {
  const formValues = useFormContext().getValues();
  
  return <ConfirmationScreen formState={formValues} clients={clients} />;
}
