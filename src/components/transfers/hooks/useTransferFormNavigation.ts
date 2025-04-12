
import { useCallback, useEffect } from 'react';
import { useTransferFormWithFormContext } from '../context/TransferFormContext';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

export const useTransferFormNavigation = (
  onSubmit: (values: any) => void
) => {
  const { 
    currentStep, 
    setCurrentStep, 
    activeSteps,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
    setShowCollaboratorStep,
    isServicioPropio,
    setIsServicioPropio,
    watch,
    setValue
  } = useTransferFormWithFormContext();
  
  const { user } = useAuth();
  const collaboratorValue = watch('collaborator');
  const serviceType = watch('serviceType');
  
  // Update showCollaboratorStep based on servicio propio status
  useEffect(() => {
    if (isServicioPropio) {
      setShowCollaboratorStep(false);
      // Set the collaborator value to "servicio propio"
      setValue('collaborator', 'servicio propio', { shouldValidate: false });
    } else {
      setShowCollaboratorStep(true);
    }
  }, [isServicioPropio, setShowCollaboratorStep, setValue]);
  
  // Set default destination for dispo service type
  useEffect(() => {
    if (serviceType === 'dispo') {
      const destination = getValues('destination');
      if (!destination || destination.trim() === '') {
        setValue('destination', 'N/A', { shouldValidate: false });
      }
    }
  }, [serviceType, getValues, setValue]);
  
  // Get fields that should be validated for each step
  const getFieldsForStep = (stepId: string): string[] => {
    switch (stepId) {
      case 'client':
        return ['clientId']; 
      case 'datetime':
        return ['date']; 
      case 'location':
        if (serviceType === 'transfer') {
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

  // Enhanced navigation to handle servicio propio flow
  const getNextStepIndex = useCallback(() => {
    if (isServicioPropio && activeSteps[currentStep]?.id === 'pricing') {
      // Skip collaborator step, go straight to confirmation
      return activeSteps.findIndex(step => step.id === 'confirmation');
    }
    return currentStep + 1;
  }, [currentStep, activeSteps, isServicioPropio]);

  // Improved handleNext with better validation and error handling
  const handleNext = useCallback(async () => {
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
      
      handleSubmit(submitHandler)();
      return;
    }

    // Validate current step fields
    const stepFields = getFieldsForStep(activeSteps[currentStep]?.id);
    console.log('Validating fields:', stepFields);
    
    if (stepFields.length === 0 || await trigger(stepFields as any)) {
      const nextStepIndex = getNextStepIndex();
      setCurrentStep(nextStepIndex);
      window.scrollTo(0, 0);
    } else {
      console.log('Validation errors:', errors);
      toast.error('Por favor complete todos los campos requeridos');
    }
  }, [currentStep, activeSteps, handleSubmit, onSubmit, trigger, errors, getNextStepIndex, user, serviceType, getValues, isServicioPropio]);

  // Enhanced previous step handler
  const handlePrevious = useCallback(() => {
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
  }, [currentStep, setCurrentStep, isServicioPropio, activeSteps]);

  return {
    handleNext,
    handlePrevious
  };
};
