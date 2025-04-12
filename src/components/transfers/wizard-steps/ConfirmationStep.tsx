
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { ConfirmationScreen } from './confirmation/ConfirmationScreen';

interface ConfirmationStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function ConfirmationStep({ clients, collaborators, formState }: ConfirmationStepProps) {
  const methods = useFormContext();
  const isMobile = useIsMobile();
  
  // Get current values from the form
  const values = methods.getValues();
  
  return (
    <div className={isMobile ? "px-1" : "px-4"}>
      <h3 className="font-medium text-lg mb-4">Confirmación</h3>
      
      <ConfirmationScreen 
        formState={values} 
        clients={clients}
      />
    </div>
  );
}
