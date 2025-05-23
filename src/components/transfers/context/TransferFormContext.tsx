
import React, { createContext, useContext, ReactNode } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Form } from '@/components/ui/form';

// Create context type
type TransferFormContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  activeSteps: Array<{ id: string; title: string; component: React.ComponentType<any> }>;
  showCollaboratorStep: boolean;
  setShowCollaboratorStep: (show: boolean) => void;
  isServicioPropio: boolean;
  setIsServicioPropio: (isPropio: boolean) => void;
};

// Create the context
const TransferFormContext = createContext<TransferFormContextType | undefined>(undefined);

// Create the provider component
interface TransferFormProviderProps {
  children: ReactNode;
  methods: UseFormReturn<TransferFormValues>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  activeSteps: Array<{ id: string; title: string; component: React.ComponentType<any> }>;
  showCollaboratorStep: boolean;
  setShowCollaboratorStep: (show: boolean) => void;
  isServicioPropio: boolean;
  setIsServicioPropio: (isPropio: boolean) => void;
}

export const TransferFormProvider: React.FC<TransferFormProviderProps> = ({
  children,
  methods,
  currentStep,
  setCurrentStep,
  activeSteps,
  showCollaboratorStep,
  setShowCollaboratorStep,
  isServicioPropio,
  setIsServicioPropio,
}) => {
  const contextValue: TransferFormContextType = {
    currentStep,
    setCurrentStep,
    activeSteps,
    showCollaboratorStep,
    setShowCollaboratorStep,
    isServicioPropio,
    setIsServicioPropio,
  };

  return (
    <Form {...methods}>
      <TransferFormContext.Provider value={contextValue}>
        {children}
      </TransferFormContext.Provider>
    </Form>
  );
};

// Create a hook to use the context
export const useTransferForm = () => {
  const context = useContext(TransferFormContext);
  if (context === undefined) {
    throw new Error('useTransferForm must be used within a TransferFormProvider');
  }
  return context;
};

// Helper hook to get both form context and transfer form context together
export const useTransferFormWithFormContext = () => {
  const formContext = useFormContext<TransferFormValues>();
  const transferFormContext = useTransferForm();
  
  return { 
    ...formContext,
    ...transferFormContext
  };
};
