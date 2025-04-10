
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useTransferForm } from '../context/TransferFormContext';

export function StepProgressBar() {
  const { currentStep, activeSteps } = useTransferForm();
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / activeSteps.length) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2 text-sm text-muted-foreground">
        <span>Paso {currentStep + 1} de {activeSteps.length}</span>
        <span>{activeSteps[currentStep]?.title}</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
