
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';

export const useTransferFormNavigation = (
  activeSteps: Array<{ id: string; title: string; component: React.ComponentType<any> }>,
  onSubmit: (values: any) => void
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCollaboratorStep, setShowCollaboratorStep] = useState(true);
  const methods = useFormContext<TransferFormValues>();
  
  // Add logging to track step progression
  useEffect(() => {
    console.log('Current step:', currentStep, activeSteps[currentStep]?.id);
    console.log('Form values:', methods.getValues());
  }, [currentStep, activeSteps, methods]);
  
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

  // Handle next step
  const handleNext = async () => {
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
    const stepFields = getFieldsForStep(activeSteps[currentStep]?.id);
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

  return {
    currentStep,
    setCurrentStep,
    showCollaboratorStep,
    setShowCollaboratorStep,
    handleNext,
    handlePrevious
  };
};
