
import React from 'react';
import { useTransferForm } from '../context/TransferFormContext';
import { Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function FormStepper() {
  const { currentStep, activeSteps } = useTransferForm();
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-8">
      {isMobile ? (
        <div className="flex justify-between items-center">
          {activeSteps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center space-y-1",
                  index === activeSteps.length - 1 ? "" : "flex-1"
                )}
              >
                <div
                  className={cn(
                    "relative flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium",
                    isComplete ? "border-primary bg-primary text-primary-foreground" : 
                    isCurrent ? "border-primary bg-background text-primary" :
                    "border-muted-foreground/30 bg-background text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {!isMobile && (
                  <span 
                    className={cn(
                      "text-xs",
                      isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                )}
                {index < activeSteps.length - 1 && (
                  <div 
                    className={cn(
                      "absolute top-3 left-0 h-px w-full",
                      isComplete ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                    style={{ left: '50%', width: '100%' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <nav aria-label="Progress">
          <ol className="flex space-x-2">
            {activeSteps.map((step, index) => {
              const isComplete = index < currentStep;
              const isCurrent = index === currentStep;
              const isLast = index === activeSteps.length - 1;
              
              return (
                <li key={step.id} className="relative flex-1">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors",
                        isComplete ? "bg-primary border-primary" : 
                        isCurrent ? "border-primary" : 
                        "border-muted-foreground/30"
                      )}
                    >
                      {isComplete ? (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <span 
                          className={cn(
                            "text-sm font-medium",
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                    
                    {!isLast && (
                      <div 
                        className={cn(
                          "flex-1 h-0.5 ml-2",
                          isComplete ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                    )}
                  </div>
                  
                  <span 
                    className={cn(
                      "absolute mt-1 w-max text-xs font-medium",
                      isCurrent ? "text-primary" : 
                      isComplete ? "text-muted-foreground" : 
                      "text-muted-foreground/60"
                    )}
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                  >
                    {step.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      
      {isMobile && (
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-primary">
            {activeSteps[currentStep]?.title}
          </span>
        </div>
      )}
    </div>
  );
}
