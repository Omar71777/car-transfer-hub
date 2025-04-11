
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
    watch,
    setValue
  } = useTransferFormWithFormContext();
  
  // Get user authentication context
  const { user } = useAuth();
  
  // Watch collaborator value to determine if we should show collaborator step
  const collaboratorValue = watch('collaborator');
  const serviceType = watch('serviceType');
  
  // Update showCollaboratorStep - ALWAYS show the collaborator step now
  useEffect(() => {
    // Always show collaborator step regardless of value
    setShowCollaboratorStep(true);
  }, [collaboratorValue, setShowCollaboratorStep]);
  
  // Fill in default values for destination when service type is 'dispo'
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
        return ['clientId']; // Only require clientId, not clientName (which is optional for existing clients)
      case 'datetime':
        return ['date']; // time is optional
      case 'location':
        // For location, we need different validations based on service type
        if (serviceType === 'transfer') {
          return ['serviceType', 'origin', 'destination'];
        }
        return ['serviceType', 'origin', 'hours'];
      case 'pricing':
        return ['price', 'paymentStatus']; // Validate both price and payment status for combined step
      case 'collaborator':
        // Commission is optional, collaborator can be 'none'
        return [];
      case 'confirmation':
        return []; // No specific fields to validate in confirmation step
      default:
        return [];
    }
  };

  // Find the next step index, never skip collaborator
  const getNextStepIndex = useCallback(() => {
    return currentStep + 1;
  }, [currentStep]);

  // Handle next step
  const handleNext = useCallback(async () => {
    console.log('Attempting to move to next step from:', activeSteps[currentStep]?.id);
    
    // If this is the last step, submit the form
    if (currentStep === activeSteps.length - 1) {
      console.log('Final step reached - submitting form');
      
      // Validate the authentication state
      if (!user) {
        console.error('User not authenticated during form submission');
        toast.error('Debe iniciar sesión para crear un transfer');
        return;
      }
      
      // Create a submit handler that processes the form data
      const submitHandler = (data: any) => {
        try {
          console.log('Form data before processing:', data);
          
          // Ensure required fields for specific service types
          if (data.serviceType === 'dispo') {
            // For dispositions, we need hours and origin
            if (!data.hours || data.hours.trim() === '') {
              toast.error('Las horas son requeridas para disposiciones');
              return;
            }
            
            // Set default destination for dispo if empty
            if (!data.destination || data.destination.trim() === '') {
              data.destination = 'N/A';
            }
          } else if (data.serviceType === 'transfer') {
            // For transfers, we need origin and destination
            if (!data.origin || data.origin.trim() === '') {
              toast.error('El origen es requerido para transfers');
              return;
            }
            if (!data.destination || data.destination.trim() === '') {
              toast.error('El destino es requerido para transfers');
              return;
            }
          }
          
          // Process the form data
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
          
          console.log('Submitting form with processed data:', processedValues);
          onSubmit(processedValues);
        } catch (error: any) {
          console.error('Error during form submission:', error);
          toast.error(`Error al procesar el formulario: ${error.message || 'Error desconocido'}`);
        }
      };
      
      // Execute the submit handler with the form data
      handleSubmit(submitHandler)();
      return;
    }

    // Validate current step fields before proceeding
    const stepFields = getFieldsForStep(activeSteps[currentStep]?.id);
    console.log('Validating fields for current step:', stepFields);
    
    // If there are no fields to validate for this step, or validation passes, proceed
    if (stepFields.length === 0 || await trigger(stepFields as any)) {
      const nextStepIndex = getNextStepIndex();
      setCurrentStep(nextStepIndex);
      window.scrollTo(0, 0);
    } else {
      console.log('Validation errors:', errors);
      toast.error('Por favor complete todos los campos requeridos antes de continuar');
    }
  }, [currentStep, activeSteps, handleSubmit, onSubmit, trigger, errors, getNextStepIndex, user, setValue, serviceType, getValues]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep, setCurrentStep]);

  return {
    handleNext,
    handlePrevious
  };
};
