
import React from 'react';
import { ExtraChargesForm } from '../form-fields/ExtraChargesForm';
import { ExtraCharge } from '@/types';

interface ExtraChargesTabProps {
  extraCharges: Partial<ExtraCharge>[];
  onAddCharge: () => void;
  onRemoveCharge: (index: number) => void;
  onChangeCharge: (index: number, field: keyof ExtraCharge, value: any) => void;
}

export function ExtraChargesTab({ 
  extraCharges, 
  onAddCharge, 
  onRemoveCharge, 
  onChangeCharge 
}: ExtraChargesTabProps) {
  return (
    <ExtraChargesForm
      extraCharges={extraCharges}
      onAddCharge={onAddCharge}
      onRemoveCharge={onRemoveCharge}
      onChangeCharge={onChangeCharge}
    />
  );
}
