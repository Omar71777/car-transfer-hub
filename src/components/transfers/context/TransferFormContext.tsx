
import React, { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { FormProvider, UseFormReturn, useFormContext } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';

// Create context type
type TransferFormContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  activeSteps: Array<{ id: string; title: string; component: React.ComponentType<any> }>;
  showCollaboratorStep: boolean;
  setShowCollaboratorStep: (show: boolean) => void;
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
}

export const TransferFormProvider: React.FC<TransferFormProviderProps> = ({
  children,
  methods,
  currentStep,
  setCurrentStep,
  activeSteps,
  showCollaboratorStep,
  setShowCollaboratorStep,
}) => {
  const contextValue: TransferFormContextType = {
    currentStep,
    setCurrentStep,
    activeSteps,
    showCollaboratorStep,
    setShowCollaboratorStep,
  };

  return (
    <TransferFormContext.Provider value={contextValue}>
      {children}
    </TransferFormContext.Provider>
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
