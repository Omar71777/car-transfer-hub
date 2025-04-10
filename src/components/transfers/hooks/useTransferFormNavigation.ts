
import { useCallback, useEffect } from 'react';
import { useTransferFormWithFormContext } from '../context/TransferFormContext';
import { toast } from 'sonner';

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
    formState: { errors },
    setShowCollaboratorStep,
    watch
  } = useTransferFormWithFormContext();
  
  // Watch collaborator value to determine if we should show collaborator step
  const collaboratorValue = watch('collaborator');
  
  // Update showCollaboratorStep based on the collaborator value
  useEffect(() => {
    // If collaborator is 'none', we should skip the collaborator step
    setShowCollaboratorStep(collaboratorValue !== 'none');
  }, [collaboratorValue, setShowCollaboratorStep]);
  
  // Get fields that should be validated for each step
  const getFieldsForStep = (stepId: string): string[] => {
    switch (stepId) {
      case 'client':
        return ['clientId']; // Only require clientId, not clientName (which is optional for existing clients)
      case 'datetime':
        return ['date']; // time is optional
      case 'location':
        // For location, we need different validations based on service type
        const serviceType = getValues('serviceType');
        if (serviceType === 'transfer') {
          return ['serviceType', 'origin', 'destination'];
        }
        return ['serviceType', 'origin', 'hours'];
      case 'pricing':
        return ['price', 'paymentStatus']; // Don't validate discounts as they're optional
      case 'extraCharges':
        return []; // Extra charges are optional
      case 'collaborator':
        // Collaborator is required if it's a collaborator service
        return collaboratorValue !== 'none' ? ['collaborator'] : [];
      default:
        return [];
    }
  };

  // Find the next step index, skipping collaborator if needed
  const getNextStepIndex = useCallback(() => {
    // If current step + 1 would be collaborator step but we should skip it
    if (activeSteps[currentStep + 1]?.id === 'collaborator' && collaboratorValue === 'none') {
      return currentStep + 2; // Skip to the step after collaborator
    }
    return currentStep + 1; // Otherwise go to the next step
  }, [currentStep, activeSteps, collaboratorValue]);

  // Handle next step
  const handleNext = useCallback(async () => {
    console.log('Attempting to move to next step from:', activeSteps[currentStep]?.id);
    
    // If this is the last step, submit the form
    if (currentStep === activeSteps.length - 1) {
      console.log('Final step reached - submitting form');
      return handleSubmit((data) => {
        // Process the form data
        const processedValues = {
          ...data,
          price: Number(data.price),
          commission: data.commission ? Number(data.commission) : 0,
          discountValue: data.discountValue ? Number(data.discountValue) : 0,
          extraCharges: (data.extraCharges || []).filter(charge => 
            charge.name && charge.price && charge.name.trim() !== ''
          ).map(charge => ({
            name: charge.name,
            price: Number(charge.price)
          }))
        };
        console.log('Submitting form with data:', processedValues);
        onSubmit(processedValues);
      })();
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
  }, [currentStep, activeSteps, handleSubmit, onSubmit, trigger, getValues, setCurrentStep, errors, getNextStepIndex]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      // If we're on the step after collaborator and collaborator is skipped
      if (activeSteps[currentStep - 1]?.id === 'collaborator' && collaboratorValue === 'none') {
        setCurrentStep(currentStep - 2); // Go back two steps to skip collaborator
      } else {
        setCurrentStep(currentStep - 1); // Go back one step normally
      }
      window.scrollTo(0, 0);
    }
  }, [currentStep, setCurrentStep, activeSteps, collaboratorValue]);

  return {
    handleNext,
    handlePrevious
  };
};
