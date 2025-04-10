
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTransferForm } from '../context/TransferFormContext';

interface TransferFormNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function TransferFormNavigation({ onPrevious, onNext }: TransferFormNavigationProps) {
  const { currentStep, activeSteps } = useTransferForm();
  const isLastStep = currentStep === activeSteps.length - 1;
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    onNext();
  };
  
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    onPrevious();
  };
  
  return (
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
        {isLastStep ? (
          <>
            <Check className="mr-1 h-4 w-4" />
            Completar
          </>
        ) : (
          <>
            Siguiente
            <ChevronRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
