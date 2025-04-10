
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExtraCharge } from '@/types';

export function useExtraCharges(initialCharges: Partial<ExtraCharge>[] = []) {
  const [extraCharges, setExtraCharges] = useState<Partial<ExtraCharge>[]>(initialCharges);

  const handleAddExtraCharge = () => {
    setExtraCharges([...extraCharges, { id: uuidv4(), name: '', price: '' }]);
  };

  const handleRemoveExtraCharge = (index: number) => {
    const newExtraCharges = [...extraCharges];
    newExtraCharges.splice(index, 1);
    setExtraCharges(newExtraCharges);
  };

  const handleExtraChargeChange = (index: number, field: keyof ExtraCharge, value: any) => {
    const newExtraCharges = [...extraCharges];
    (newExtraCharges[index] as any)[field] = value;
    setExtraCharges(newExtraCharges);
  };

  return {
    extraCharges,
    setExtraCharges,
    handleAddExtraCharge,
    handleRemoveExtraCharge,
    handleExtraChargeChange
  };
}
