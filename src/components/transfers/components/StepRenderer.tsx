
import React from 'react';
import { useTransferForm } from '../context/TransferFormContext';
import { useFormContext } from 'react-hook-form';

interface StepRendererProps {
  clients: any[];
  collaborators: any[];
}

export function StepRenderer({ clients, collaborators }: StepRendererProps) {
  const { currentStep, activeSteps } = useTransferForm();
  const formState = useFormContext().getValues();
  
  const CurrentStepComponent = activeSteps[currentStep]?.component;

  return (
    <div className="min-h-[300px] py-4">
      <CurrentStepComponent 
        clients={clients} 
        collaborators={collaborators} 
        formState={formState}
      />
    </div>
  );
}
