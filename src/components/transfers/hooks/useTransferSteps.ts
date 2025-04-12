
import { useMemo } from 'react';
import { BasicInfoStep } from '../wizard-steps/BasicInfoStep';
import { PricingStep } from '../wizard-steps/PricingStep';
import { ExtraChargesStep } from '../wizard-steps/ExtraChargesStep';
import { CollaboratorStep } from '../wizard-steps/CollaboratorStep';
import { ConfirmationStep } from '../wizard-steps/ConfirmationStep';
import { DateTimeStep } from '../wizard-steps/DateTimeStep';
import { LocationStep } from '../wizard-steps/LocationStep';

interface UseTransferStepsProps {
  isServicioPropio: boolean;
  showCollaboratorStep: boolean;
}

export function useTransferSteps({ isServicioPropio, showCollaboratorStep }: UseTransferStepsProps) {
  // Define all available steps
  const allSteps = [
    { id: 'client', title: 'Cliente', component: BasicInfoStep },
    { id: 'datetime', title: 'Fecha y Hora', component: DateTimeStep },
    { id: 'location', title: 'Ubicación', component: LocationStep },
    { id: 'pricing', title: 'Precio', component: PricingStep },
    { id: 'collaborator', title: 'Colaborador', component: CollaboratorStep },
    { id: 'confirmation', title: 'Confirmación', component: ConfirmationStep }
  ];
  
  // Determine which steps should be active
  const activeSteps = useMemo(() => {
    if (isServicioPropio) {
      // When "servicio propio" is selected, skip the collaborator step
      return allSteps.filter(step => step.id !== 'collaborator');
    } else if (!showCollaboratorStep) {
      // When explicitly hiding collaborator step
      return allSteps.filter(step => step.id !== 'collaborator');
    }
    return allSteps;
  }, [isServicioPropio, showCollaboratorStep]);
  
  return {
    activeSteps
  };
}
