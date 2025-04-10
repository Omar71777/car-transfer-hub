
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { ClientStep } from './wizard-steps/ClientStep';
import { DateTimeStep } from './wizard-steps/DateTimeStep';
import { LocationStep } from './wizard-steps/LocationStep';
import { PricingStep } from './wizard-steps/PricingStep';
import { ExtraChargesStep } from './wizard-steps/ExtraChargesStep';
import { CollaboratorStep } from './wizard-steps/CollaboratorStep';
import { ConfirmationStep } from './wizard-steps/ConfirmationStep';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useClients } from '@/hooks/useClients';
import { TransferFormProvider } from './context/TransferFormContext';
import { StepProgressBar } from './components/StepProgressBar';
import { StepRenderer } from './components/StepRenderer';
import { TransferFormNavigation } from './components/TransferFormNavigation';
import { useTransferFormNavigation } from './hooks/useTransferFormNavigation';

interface ConversationalTransferFormProps {
  onSubmit: (values: any) => void;
}

export function ConversationalTransferForm({ onSubmit }: ConversationalTransferFormProps) {
  // Define steps
  const steps = [
    { id: 'client', title: 'Cliente', component: ClientStep },
    { id: 'datetime', title: 'Fecha y Hora', component: DateTimeStep },
    { id: 'location', title: 'Ubicación', component: LocationStep },
    { id: 'pricing', title: 'Precio', component: PricingStep },
    { id: 'extraCharges', title: 'Cargos Extra', component: ExtraChargesStep },
    { id: 'collaborator', title: 'Colaborador', component: CollaboratorStep },
    { id: 'confirmation', title: 'Confirmación', component: ConfirmationStep },
  ];

  const [showCollaboratorStep, setShowCollaboratorStep] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    collaborators,
    loading: loadingCollaborators,
    fetchCollaborators
  } = useCollaborators();
  
  const {
    clients,
    loading: loadingClients,
    fetchClients
  } = useClients();

  // Fetch data when component mounts
  React.useEffect(() => {
    fetchCollaborators();
    fetchClients();
  }, [fetchCollaborators, fetchClients]);

  const methods = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: '',
      serviceType: 'transfer',
      origin: '',
      destination: '',
      hours: '',
      price: '',
      discountType: null,
      discountValue: '',
      extraCharges: [],
      collaborator: '',
      commissionType: 'percentage',
      commission: '',
      paymentStatus: 'pending',
      clientId: ''
    },
    mode: 'onTouched'
  });

  // If we don't need the collaborator step, remove it from the flow
  const activeSteps = showCollaboratorStep 
    ? steps 
    : steps.filter(step => step.id !== 'collaborator');
  
  // Create the navigation handlers first
  const navigateProps = {
    handleNext: () => {}, 
    handlePrevious: () => {}
  };

  return (
    <TransferFormProvider 
      methods={methods}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      activeSteps={activeSteps}
      showCollaboratorStep={showCollaboratorStep}
      setShowCollaboratorStep={setShowCollaboratorStep}
    >
      <Card className="glass-card w-full max-w-2xl mx-auto">
        <CardContent className="p-4 md:p-6">
          <StepProgressBar />

          <StepRenderer 
            clients={clients} 
            collaborators={collaborators} 
          />

          {/* We initialize the navigation component with the navigation handlers we get from the hook */}
          <TransferFormNavigation 
            onPrevious={() => navigateProps.handlePrevious()}
            onNext={() => navigateProps.handleNext()}
          />
        </CardContent>
      </Card>

      {/* This hook needs to be used inside the FormProvider, but we need to assign its return values */}
      <NavigationHandlersSetup 
        activeSteps={activeSteps} 
        onSubmit={onSubmit} 
        setHandlers={(handlers) => {
          navigateProps.handleNext = handlers.handleNext;
          navigateProps.handlePrevious = handlers.handlePrevious;
        }}
      />
    </TransferFormProvider>
  );
}

// A utility component to set up the navigation handlers
const NavigationHandlersSetup = ({ 
  activeSteps, 
  onSubmit, 
  setHandlers 
}: { 
  activeSteps: any[],
  onSubmit: (values: any) => void,
  setHandlers: (handlers: { handleNext: () => void, handlePrevious: () => void }) => void
}) => {
  const { handleNext, handlePrevious } = useTransferFormNavigation(activeSteps, onSubmit);
  
  // Set the handlers on mount and when they change
  React.useEffect(() => {
    setHandlers({ handleNext, handlePrevious });
  }, [handleNext, handlePrevious, setHandlers]);
  
  return null;
};
