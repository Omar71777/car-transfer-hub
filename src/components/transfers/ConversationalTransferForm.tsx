
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
import { useAuth } from '@/contexts/auth';

// Import steps
import { BasicInfoStep } from './wizard-steps/BasicInfoStep';
import { PricingStep } from './wizard-steps/PricingStep';
import { ExtraChargesStep } from './wizard-steps/ExtraChargesStep';
import { CollaboratorStep } from './wizard-steps/CollaboratorStep';
import { ConfirmationStep } from './wizard-steps/ConfirmationStep';
import { DateTimeStep } from './wizard-steps/DateTimeStep';
import { LocationStep } from './wizard-steps/LocationStep';

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
  const { user } = useAuth();
  
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
  
  const isLastStep = currentStep === activeSteps.length - 1;
  const isFirstStep = currentStep === 0;
  
  // Define navigation functions here instead of using the hook outside the provider
  const handleNext = async () => {
    console.log('Moving to next step from:', activeSteps[currentStep]?.id);
    
    // If this is the last step, submit the form
    if (currentStep === activeSteps.length - 1) {
      console.log('Final step - submitting form');
      
      // Validate user authentication
      if (!user) {
        console.error('Authentication required');
        toast.error('Debe iniciar sesión para crear un transfer');
        return;
      }
      
      // Create a submit handler with proper data validation
      const submitHandler = (data: any) => {
        try {
          console.log('Processing form data:', data);
          
          // Validate service type specific fields
          if (data.serviceType === 'dispo') {
            if (!data.hours || data.hours.trim() === '') {
              toast.error('Las horas son requeridas para disposiciones');
              return;
            }
            
            if (!data.destination || data.destination.trim() === '') {
              data.destination = 'N/A';
            }
          } else if (data.serviceType === 'transfer') {
            if (!data.origin || data.origin.trim() === '') {
              toast.error('El origen es requerido para transfers');
              return;
            }
            if (!data.destination || data.destination.trim() === '') {
              toast.error('El destino es requerido para transfers');
              return;
            }
          }
          
          // Process form data
          const processedValues = {
            ...data,
            price: Number(data.price),
            commission: data.commission ? Number(data.commission) : 0,
            discountValue: data.discountValue ? Number(data.discountValue) : 0,
            extraCharges: (data.extraCharges || []).filter((charge: any) => 
              charge && charge.name && charge.price && charge.name.trim() !== ''
            ).map((charge: any) => ({
              name: charge.name,
              price: Number(charge.price)
            }))
          };
          
          console.log('Submitting with processed data:', processedValues);
          onSubmit(processedValues);
        } catch (error: any) {
          console.error('Form submission error:', error);
          toast.error(`Error al procesar el formulario: ${error.message || 'Error desconocido'}`);
        }
      };
      
      form.handleSubmit(submitHandler)();
      return;
    }

    // Get fields that should be validated for each step
    const getFieldsForStep = (stepId: string): string[] => {
      switch (stepId) {
        case 'client':
          return ['clientId']; 
        case 'datetime':
          return ['date']; 
        case 'location':
          if (form.getValues('serviceType') === 'transfer') {
            return ['serviceType', 'origin', 'destination'];
          }
          return ['serviceType', 'origin', 'hours'];
        case 'pricing':
          return ['price', 'paymentStatus']; 
        case 'collaborator':
          return [];
        case 'confirmation':
          return []; 
        default:
          return [];
      }
    };

    // Validate current step fields
    const stepFields = getFieldsForStep(activeSteps[currentStep]?.id);
    console.log('Validating fields:', stepFields);
    
    if (stepFields.length === 0 || await form.trigger(stepFields as any)) {
      // Handle servicio propio flow
      if (isServicioPropio && activeSteps[currentStep]?.id === 'pricing') {
        // Skip collaborator step, go straight to confirmation
        const confirmationIndex = activeSteps.findIndex(step => step.id === 'confirmation');
        setCurrentStep(confirmationIndex);
      } else {
        setCurrentStep(currentStep + 1);
      }
      window.scrollTo(0, 0);
    } else {
      console.log('Validation errors:', form.formState.errors);
      toast.error('Por favor complete todos los campos requeridos');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Handle special case for servicio propio
      if (isServicioPropio && activeSteps[currentStep]?.id === 'confirmation') {
        const pricingIndex = activeSteps.findIndex(step => step.id === 'pricing');
        setCurrentStep(pricingIndex);
      } else {
        setCurrentStep(currentStep - 1);
      }
      window.scrollTo(0, 0);
    }
  };
  
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
