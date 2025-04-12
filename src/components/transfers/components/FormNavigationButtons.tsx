
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface FormNavigationButtonsProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export function FormNavigationButtons({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting
}: FormNavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-2 mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex-1 flex-grow-0"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>
      
      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="flex-1 flex-grow-0"
      >
        {isSubmitting ? (
          <span>Procesando...</span>
        ) : isLastStep ? (
          <>
            <Check className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Completar</span>
            <span className="sm:hidden">Finalizar</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Siguiente</span>
            <span className="sm:hidden">Siguiente</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
