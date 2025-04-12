
import React from 'react';
import { useTransferForm } from '../context/TransferFormContext';
import { Check, Circle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function FormStepper() {
  const { currentStep, activeSteps, setCurrentStep } = useTransferForm();
  const isMobile = useIsMobile();
  
  return (
    <div className={`mb-6 ${isMobile ? 'overflow-x-auto pb-2' : ''}`}>
      <div className={`flex items-center ${isMobile ? 'min-w-max' : 'justify-between'}`}>
        {activeSteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={step.id}>
              <div 
                className={`flex flex-col items-center ${isMobile ? 'mx-2' : ''}`}
                onClick={() => index < currentStep && setCurrentStep(index)}
              >
                <div 
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full 
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' : 
                      'bg-muted text-muted-foreground'}
                    ${index < currentStep ? 'cursor-pointer hover:opacity-80' : ''}
                    transition-colors
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span 
                  className={`
                    text-xs mt-1.5 
                    ${isCurrent ? 'font-medium text-primary' : 
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                    ${isMobile ? 'max-w-[60px] text-center truncate' : ''}
                  `}
                >
                  {step.title}
                </span>
              </div>
              
              {index < activeSteps.length - 1 && (
                <div 
                  className={`
                    h-px flex-1 
                    ${index < currentStep ? 'bg-primary' : 
                      index === currentStep ? 'bg-gradient-to-r from-primary to-muted-foreground/30' : 
                      'bg-muted-foreground/30'}
                    ${isMobile ? 'w-6' : ''}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
