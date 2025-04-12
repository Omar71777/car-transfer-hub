
import React from 'react';
import { useClients } from '@/hooks/useClients';
import { TransferFormProvider } from './context/TransferFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { Transfer } from '@/types';
import { useCollaborators } from '@/hooks/useCollaborators';
import { FormStepper } from './components/FormStepper';
import { StepRenderer } from './components/StepRenderer';
import { FormNavigationButtons } from './components/FormNavigationButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTransferFormState } from './hooks/useTransferFormState';
import { useTransferSteps } from './hooks/useTransferSteps';
import { useTransferNavigation } from './hooks/useTransferNavigation';
import { cn } from '@/lib/utils';

interface ConversationalTransferFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Transfer;
  isEditing?: boolean;
  initialClientId?: string | null;
}

export function ConversationalTransferForm({
  onSubmit,
  initialValues,
  isEditing = false,
  initialClientId = null
}: ConversationalTransferFormProps) {
  const { clients, loading: loadingClients } = useClients();
  const { collaborators, loading: loadingCollaborators } = useCollaborators();
  const isMobile = useIsMobile();
  
  // Use our custom hooks
  const {
    form,
    currentStep,
    setCurrentStep,
    showCollaboratorStep,
    setShowCollaboratorStep,
    isServicioPropio,
    setIsServicioPropio,
    user
  } = useTransferFormState({ onSubmit, initialValues, isEditing, initialClientId });
  
  const { activeSteps } = useTransferSteps({ isServicioPropio, showCollaboratorStep });
  
  const {
    isLastStep,
    isFirstStep,
    isSubmitting,
    handleNext,
    handlePrevious
  } = useTransferNavigation({
    currentStep, 
    setCurrentStep, 
    activeSteps, 
    isServicioPropio, 
    form, 
    onSubmit,
    user
  });
  
  return (
    <TransferFormProvider
      methods={form}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      activeSteps={activeSteps}
      showCollaboratorStep={showCollaboratorStep}
      setShowCollaboratorStep={setShowCollaboratorStep}
      isServicioPropio={isServicioPropio}
      setIsServicioPropio={setIsServicioPropio}
    >
      <Card className={cn(
        "glass-card w-full mx-auto",
        isMobile ? "p-3" : "p-6"
      )}>
        <CardContent className={cn(
          "pt-4",
          isMobile ? "px-2" : "px-6"
        )}>
          {/* Form Stepper */}
          <FormStepper />
          
          {/* Step Content */}
          <StepRenderer 
            clients={clients} 
            collaborators={collaborators} 
          />
          
          {/* Navigation Buttons */}
          <FormNavigationButtons 
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </TransferFormProvider>
  );
}
