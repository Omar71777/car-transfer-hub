
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className={isMobile ? "text-xs px-3 py-1.5" : ""}
      >
        <ArrowLeft className={isMobile ? "h-4 w-4 mr-1" : "h-4 w-4 mr-2"} />
        Anterior
      </Button>
      
      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className={isMobile ? "text-xs px-3 py-1.5" : ""}
      >
        {isLastStep ? (
          <>
            <Check className={isMobile ? "h-4 w-4 mr-1" : "h-4 w-4 mr-2"} />
            {isSubmitting ? 'Guardando...' : 'Finalizar'}
          </>
        ) : (
          <>
            Siguiente
            <ArrowRight className={isMobile ? "h-4 w-4 ml-1" : "h-4 w-4 ml-2"} />
          </>
        )}
      </Button>
    </div>
  );
}
