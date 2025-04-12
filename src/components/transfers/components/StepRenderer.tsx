
import React from 'react';
import { useTransferForm } from '../context/TransferFormContext';
import { useFormContext } from 'react-hook-form';

interface StepRendererProps {
  clients: any[];
  collaborators: any[];
}

export function StepRenderer({ clients, collaborators }: StepRendererProps) {
  const { currentStep, activeSteps, isServicioPropio } = useTransferForm();
  const formState = useFormContext().getValues();
  
  const CurrentStepComponent = activeSteps[currentStep]?.component;

  // Show a message if we're skipping the collaborator step because it's servicio propio
  if (isServicioPropio && activeSteps[currentStep]?.id === 'confirmation') {
    // Get confirmation step component
    const Component = activeSteps[currentStep]?.component;
    
    return (
      <div className="min-h-[300px] py-4">
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          <p className="text-sm">Servicio configurado como <strong>servicio propio</strong>. No se requiere colaborador.</p>
        </div>
        <Component 
          clients={clients} 
          collaborators={collaborators} 
          formState={formState}
        />
      </div>
    );
  }

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
