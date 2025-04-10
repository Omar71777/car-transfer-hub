
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { ClientStep } from './wizard-steps/ClientStep';
import { DateTimeStep } from './wizard-steps/DateTimeStep';
import { LocationStep } from './wizard-steps/LocationStep';
import { PricingStep } from './wizard-steps/PricingStep';
import { ExtraChargesStep } from './wizard-steps/ExtraChargesStep';
import { CollaboratorStep } from './wizard-steps/CollaboratorStep';
import { ConfirmationStep } from './wizard-steps/ConfirmationStep';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useClients } from '@/hooks/useClients';
import { Progress } from '@/components/ui/progress';

interface ConversationalTransferFormProps {
  onSubmit: (values: any) => void;
}

export function ConversationalTransferForm({ onSubmit }: ConversationalTransferFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCollaboratorStep, setShowCollaboratorStep] = useState(true);
  
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
    mode: 'onChange'
  });

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

  // If we don't need the collaborator step, remove it from the flow
  const activeSteps = showCollaboratorStep 
    ? steps 
    : steps.filter(step => step.id !== 'collaborator');

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / activeSteps.length) * 100;
  
  const CurrentStepComponent = activeSteps[currentStep].component;

  // Add logging to track step progression
  useEffect(() => {
    console.log('Current step:', currentStep, activeSteps[currentStep].id);
    console.log('Form values:', methods.getValues());
  }, [currentStep, activeSteps, methods]);

  // Handle next step
  const handleNext = async () => {
    console.log('Attempting to move to next step from:', activeSteps[currentStep].id);
    
    // If on pricing step and user selects "No collaborator", skip the commissions
    if (activeSteps[currentStep].id === 'pricing') {
      const hasCollaborator = methods.getValues('collaborator') !== '' && 
                              methods.getValues('collaborator') !== 'none';
      setShowCollaboratorStep(hasCollaborator);
    }

    // If this is the last step, submit the form
    if (currentStep === activeSteps.length - 1) {
      console.log('Final step reached - submitting form');
      methods.handleSubmit((data) => {
        // Process the form data
        const processedValues = {
          ...data,
          price: Number(data.price),
          commission: data.commission ? Number(data.commission) : 0,
          discountValue: data.discountValue ? Number(data.discountValue) : 0,
          extraCharges: (data.extraCharges || []).filter(charge => 
            charge.name && charge.price && charge.name.trim() !== '' && Number(charge.price) > 0
          ).map(charge => ({
            name: charge.name,
            price: Number(charge.price)
          }))
        };
        console.log('Submitting form with data:', processedValues);
        onSubmit(processedValues);
      })();
      return;
    }

    // Validate current step fields before proceeding
    const stepFields = getFieldsForStep(activeSteps[currentStep].id);
    console.log('Validating fields for current step:', stepFields);
    const isStepValid = await methods.trigger(stepFields as any);
    console.log('Step validation result:', isStepValid);

    if (isStepValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      console.log('Validation errors:', methods.formState.errors);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get fields that should be validated for each step
  const getFieldsForStep = (stepId: string): string[] => {
    switch (stepId) {
      case 'client':
        return ['clientId', 'clientName'];
      case 'datetime':
        return ['date', 'time'];
      case 'location':
        return ['serviceType', 'origin', ...(methods.getValues('serviceType') === 'transfer' ? ['destination'] : ['hours'])];
      case 'extraCharges':
        return ['extraCharges'];
      case 'pricing':
        return ['price', 'paymentStatus', 'discountType', 'discountValue'];
      case 'collaborator':
        return ['collaborator', 'commissionType', 'commission'];
      default:
        return [];
    }
  };

  return (
    <FormProvider {...methods}>
      <Card className="glass-card w-full max-w-2xl mx-auto">
        <CardContent className="p-4 md:p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm text-muted-foreground">
              <span>Paso {currentStep + 1} de {activeSteps.length}</span>
              <span>{activeSteps[currentStep].title}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="min-h-[300px] py-4">
            <CurrentStepComponent 
              clients={clients} 
              collaborators={collaborators} 
              formState={methods.getValues()}
            />
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center"
            >
              {currentStep === activeSteps.length - 1 ? 'Completar' : 'Siguiente'}
              {currentStep !== activeSteps.length - 1 && (
                <ChevronRight className="ml-1 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
