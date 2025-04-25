
import React from 'react';
import { ExtraChargesForm } from '../form-fields/ExtraChargesForm';
import { ExtraChargeForm } from '../hooks/useExtraCharges';

interface ExtraChargesTabProps {
  extraCharges: Partial<ExtraChargeForm>[];
  onAddCharge: () => void;
  onRemoveCharge: (index: number) => void;
  onChangeCharge: (index: number, field: keyof ExtraChargeForm, value: string) => void;
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
