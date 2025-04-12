
import React, { useState, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/useClients';
import { TransferFormProvider, useTransferForm } from './context/TransferFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { Transfer } from '@/types';
import { useCollaborators } from '@/hooks/useCollaborators';
import { FormStepper } from './components/FormStepper';
import { StepRenderer } from './components/StepRenderer';
import { FormNavigationButtons } from './components/FormNavigationButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { useTransferFormNavigation } from './hooks/useTransferFormNavigation';

// Import steps
import { BasicInfoStep } from './wizard-steps/BasicInfoStep';
import { PricingStep } from './wizard-steps/PricingStep';
import { ExtraChargesStep } from './wizard-steps/ExtraChargesStep';
import { CollaboratorStep } from './wizard-steps/CollaboratorStep';
import { ConfirmationStep } from './wizard-steps/ConfirmationStep';

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
  const {
    clients,
    loading: loadingClients
  } = useClients();
  
  const {
    collaborators,
    loading: loadingCollaborators
  } = useCollaborators();
  
  const isMobile = useIsMobile();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showCollaboratorStep, setShowCollaboratorStep] = useState(!isEditing && !initialValues?.collaborator);
  const [isServicioPropio, setIsServicioPropio] = useState(
    initialValues?.collaborator === 'servicio propio' || false
  );
  
  const getDefaultValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        serviceType: initialValues.serviceType || 'transfer',
        price: initialValues.price.toString(),
        hours: initialValues.hours !== undefined ? initialValues.hours.toString() : '',
        discountType: initialValues.discountType || null,
        discountValue: initialValues.discountValue?.toString() || '',
        commissionType: initialValues.commissionType || 'percentage',
        commission: initialValues.commission?.toString() || '',
        paymentStatus: initialValues.paymentStatus || 'pending',
        clientId: initialValues.clientId || initialClientId || '',
        extraCharges: initialValues.extraCharges 
          ? initialValues.extraCharges.map(charge => ({
              id: charge.id,
              name: charge.name,
              price: typeof charge.price === 'number' ? charge.price.toString() : charge.price
            }))
          : []
      };
    }
    
    return {
      date: new Date().toISOString().split('T')[0],
      time: '',
      serviceType: 'transfer' as const,
      origin: '',
      destination: '',
      hours: '',
      price: '',
      discountType: null,
      discountValue: '',
      collaborator: '',
      commissionType: 'percentage' as const,
      commission: '',
      paymentStatus: 'pending' as const,
      clientId: initialClientId || '',
      extraCharges: []
    };
  };
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange' // Enable onChange validation
  });
  
  // Update client ID when it changes externally
  useEffect(() => {
    if (initialClientId) {
      form.setValue('clientId', initialClientId, { shouldValidate: true });
    }
  }, [initialClientId, form]);
  
  // Define available steps
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
  
  // Use our improved navigation hook
  const { handleNext, handlePrevious } = useTransferFormNavigation(onSubmit);

  const isLastStep = currentStep === activeSteps.length - 1;
  const isFirstStep = currentStep === 0;
  
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
            isSubmitting={form.formState.isSubmitting}
          />
        </CardContent>
      </Card>
    </TransferFormProvider>
  );
}

// Helper function to conditionally join classnames
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
