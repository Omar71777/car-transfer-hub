
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExtraCharge } from '@/types';

export function useExtraCharges(initialCharges: Partial<ExtraCharge>[] = []) {
  const [extraCharges, setExtraCharges] = useState<Partial<ExtraCharge>[]>(initialCharges);

  const handleAddExtraCharge = (charges = extraCharges) => {
    const newCharges = [...charges, { id: uuidv4(), name: '', price: '' }];
    setExtraCharges(newCharges);
    return newCharges;
  };

  const handleRemoveExtraCharge = (index: number, charges = extraCharges) => {
    const newExtraCharges = [...charges];
    newExtraCharges.splice(index, 1);
    setExtraCharges(newExtraCharges);
    return newExtraCharges;
  };

  const handleExtraChargeChange = (
    index: number, 
    field: keyof ExtraCharge, 
    value: any, 
    charges = extraCharges
  ) => {
    const newExtraCharges = [...charges];
    (newExtraCharges[index] as any)[field] = value;
    setExtraCharges(newExtraCharges);
    return newExtraCharges;
  };

  return {
    extraCharges,
    setExtraCharges,
    handleAddExtraCharge,
    handleRemoveExtraCharge,
    handleExtraChargeChange
  };
}
