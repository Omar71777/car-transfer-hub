
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { ClientStep } from './wizard-steps/ClientStep';
import { DateTimeStep } from './wizard-steps/DateTimeStep';
import { LocationStep } from './wizard-steps/LocationStep';
import { PricingAndExtraChargesStep } from './wizard-steps/PricingAndExtraChargesStep';
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
  // Define steps in the new order
  const steps = [
    { id: 'client', title: 'Cliente', component: ClientStep },
    { id: 'datetime', title: 'Fecha y Hora', component: DateTimeStep },
    { id: 'location', title: 'Ubicación', component: LocationStep },
    { id: 'pricing', title: 'Precio y Cargos', component: PricingAndExtraChargesStep },
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
  useEffect(() => {
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

          <FormNavigationContainer onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </TransferFormProvider>
  );
}

// Separate component to ensure form context is fully initialized
const FormNavigationContainer = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const { handleNext, handlePrevious } = useTransferFormNavigation(onSubmit);
  
  return (
    <TransferFormNavigation 
      onPrevious={handlePrevious}
      onNext={handleNext}
    />
  );
};
