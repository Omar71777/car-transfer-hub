
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransferForm } from '../context/TransferFormContext';

interface TransferFormNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function TransferFormNavigation({ onPrevious, onNext }: TransferFormNavigationProps) {
  const { currentStep, activeSteps } = useTransferForm();

  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="flex items-center"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Anterior
      </Button>

      <Button
        type="button"
        onClick={onNext}
        className="flex items-center"
      >
        {currentStep === activeSteps.length - 1 ? 'Completar' : 'Siguiente'}
        {currentStep !== activeSteps.length - 1 && (
          <ChevronRight className="ml-1 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
