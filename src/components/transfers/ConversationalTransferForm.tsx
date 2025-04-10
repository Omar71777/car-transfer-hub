
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { transferSchema, TransferFormValues } from './schema/transferSchema';
import { ClientStep } from './wizard-steps/ClientStep';
import { DateTimeStep } from './wizard-steps/DateTimeStep';
import { LocationStep } from './wizard-steps/LocationStep';
import { PricingStep } from './wizard-steps/PricingStep';
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
      origin: '',
      destination: '',
      price: '',
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

  // Handle next step
  const handleNext = async () => {
    // If on collaborator step and user selects "No collaborator", skip the commissions
    if (activeSteps[currentStep].id === 'pricing') {
      const hasCollaborator = methods.getValues('collaborator') !== '' && 
                              methods.getValues('collaborator') !== 'none';
      setShowCollaboratorStep(hasCollaborator);
    }

    // If this is the last step, submit the form
    if (currentStep === activeSteps.length - 1) {
      methods.handleSubmit((data) => {
        // Process the form data
        const processedValues = {
          ...data,
          price: Number(data.price),
          commission: data.commission ? Number(data.commission) : 0,
        };
        onSubmit(processedValues);
      })();
      return;
    }

    // Validate current step fields before proceeding
    const stepFields = getFieldsForStep(activeSteps[currentStep].id);
    const isStepValid = await methods.trigger(stepFields as any);

    if (isStepValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
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
        return ['origin', 'destination'];
      case 'pricing':
        return ['price', 'paymentStatus'];
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
