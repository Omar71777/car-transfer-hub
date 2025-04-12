
import React from 'react';
import { useTransferForm } from '../context/TransferFormContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check } from 'lucide-react';

export function FormStepper() {
  const { currentStep, activeSteps, setCurrentStep } = useTransferForm();
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between w-full">
        {activeSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                // Only allow clicking on previous steps
                if (index <= currentStep) {
                  setCurrentStep(index);
                }
              }}
            >
              <div className={cn(
                "relative flex items-center justify-center rounded-full transition-colors",
                index < currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : index === currentStep 
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : "bg-muted text-muted-foreground",
                isMobile ? "w-8 h-8 text-xs" : "w-10 h-10"
              )}>
                {index < currentStep ? (
                  <Check className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              {!isMobile && (
                <span className={cn(
                  "mt-2 text-xs font-medium text-center",
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              )}
            </div>
            
            {/* Connector line between steps */}
            {index < activeSteps.length - 1 && (
              <div className={cn(
                "flex-1 h-px",
                index < currentStep ? "bg-primary" : "bg-border"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile step title */}
      {isMobile && (
        <div className="mt-3 text-center">
          <span className="text-sm font-medium">
            {activeSteps[currentStep]?.title || 'Paso'}
          </span>
        </div>
      )}
    </div>
  );
}
