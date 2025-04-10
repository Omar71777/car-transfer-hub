
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { toast } from 'sonner';

export const useTransferFormNavigation = (
  activeSteps: Array<{ id: string; title: string; component: React.ComponentType<any> }>,
  onSubmit: (values: any) => void
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCollaboratorStep, setShowCollaboratorStep] = useState(true);
  
  // Safely get form methods - may be null during initial render
  const methods = useFormContext<TransferFormValues>();
  
  // Add logging to track step progression
  useEffect(() => {
    if (activeSteps[currentStep]) {
      console.log('Current step:', currentStep, activeSteps[currentStep]?.id);
      // Only try to log form values if methods is available
      if (methods) {
        console.log('Form values:', methods.getValues());
      }
    }
  }, [currentStep, activeSteps, methods]);
  
  // Get fields that should be validated for each step
  const getFieldsForStep = (stepId: string): string[] => {
    switch (stepId) {
      case 'client':
        return ['clientId']; // Only require clientId, not clientName (which is optional for existing clients)
      case 'datetime':
        return ['date']; // time is optional
      case 'location':
        // For location, we need different validations based on service type
        if (methods?.getValues('serviceType') === 'transfer') {
          return ['serviceType', 'origin', 'destination'];
        }
        return ['serviceType', 'origin', 'hours'];
      case 'pricing':
        return ['price', 'paymentStatus']; // Don't validate discounts as they're optional
      case 'extraCharges':
        return []; // Extra charges are optional
      case 'collaborator':
        return ['collaborator']; // Only validate collaborator selection, commission is optional
      default:
        return [];
    }
  };

  // Handle next step
  const handleNext = async () => {
    if (!methods) {
      console.error('Form methods not available');
      toast.error('Error al procesar el formulario. Inténtelo de nuevo.');
      return;
    }
    
    console.log('Attempting to move to next step from:', activeSteps[currentStep]?.id);
    
    // If on pricing step and user selects "No collaborator", skip the commissions
    if (activeSteps[currentStep]?.id === 'pricing') {
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
            charge.name && charge.price && charge.name.trim() !== ''
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
    const stepFields = getFieldsForStep(activeSteps[currentStep]?.id);
    console.log('Validating fields for current step:', stepFields);
    
    // If there are no fields to validate for this step, or validation passes, proceed
    if (stepFields.length === 0 || await methods.trigger(stepFields as any)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      console.log('Validation errors:', methods.formState.errors);
      toast.error('Por favor complete todos los campos requeridos antes de continuar');
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    showCollaboratorStep,
    setShowCollaboratorStep,
    handleNext,
    handlePrevious
  };
};
