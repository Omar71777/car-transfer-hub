
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';

interface UseTransferNavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  activeSteps: Array<{ id: string; title: string; component: React.ComponentType<any> }>;
  isServicioPropio: boolean;
  form: UseFormReturn<TransferFormValues>;
  onSubmit: (values: any) => void;
  user: User | null;
}

export function useTransferNavigation({
  currentStep,
  setCurrentStep,
  activeSteps,
  isServicioPropio,
  form,
  onSubmit,
  user
}: UseTransferNavigationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isLastStep = currentStep === activeSteps.length - 1;
  const isFirstStep = currentStep === 0;
  
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
      
      setIsSubmitting(true);
      
      // Create a submit handler with proper data validation
      const submitHandler = (data: any) => {
        try {
          console.log('Processing form data:', data);
          
          // Validate service type specific fields
          if (data.serviceType === 'dispo') {
            if (!data.hours || data.hours.trim() === '') {
              toast.error('Las horas son requeridas para disposiciones');
              setIsSubmitting(false);
              return;
            }
            
            if (!data.destination || data.destination.trim() === '') {
              data.destination = 'N/A';
            }
          } else if (data.serviceType === 'transfer') {
            if (!data.origin || data.origin.trim() === '') {
              toast.error('El origen es requerido para transfers');
              setIsSubmitting(false);
              return;
            }
            if (!data.destination || data.destination.trim() === '') {
              toast.error('El destino es requerido para transfers');
              setIsSubmitting(false);
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
        } finally {
          setIsSubmitting(false);
        }
      };
      
      form.handleSubmit(submitHandler)();
      return;
    }

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
  
  return {
    isLastStep,
    isFirstStep,
    isSubmitting,
    handleNext,
    handlePrevious
  };
}
