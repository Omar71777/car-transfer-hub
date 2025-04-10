
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExtraCharge } from '@/types';

export function useExtraCharges(initialCharges: Partial<ExtraCharge>[] = []) {
  // Ensure initial charges have IDs
  const processedInitialCharges = initialCharges.map(charge => ({
    ...charge,
    id: charge.id || uuidv4()
  }));
  
  const [extraCharges, setExtraCharges] = useState<Partial<ExtraCharge>[]>(processedInitialCharges);

  const handleAddExtraCharge = useCallback(() => {
    console.log('Adding new extra charge');
    const newCharges = [...extraCharges, { id: uuidv4(), name: '', price: '' }];
    setExtraCharges(newCharges);
    return newCharges;
  }, [extraCharges]);

  const handleRemoveExtraCharge = useCallback((index: number) => {
    console.log('Removing extra charge at index:', index);
    if (index < 0 || index >= extraCharges.length) {
      console.error('Invalid index for removing extra charge:', index);
      return extraCharges;
    }
    
    const newExtraCharges = [...extraCharges];
    newExtraCharges.splice(index, 1);
    setExtraCharges(newExtraCharges);
    return newExtraCharges;
  }, [extraCharges]);

  const handleExtraChargeChange = useCallback((
    index: number, 
    field: keyof ExtraCharge, 
    value: any
  ) => {
    console.log(`Updating extra charge at index ${index}, field: ${field}, value: ${value}`);
    if (index < 0 || index >= extraCharges.length) {
      console.error('Invalid index for updating extra charge:', index);
      return extraCharges;
    }
    
    const newExtraCharges = [...extraCharges];
    (newExtraCharges[index] as any)[field] = value;
    setExtraCharges(newExtraCharges);
    return newExtraCharges;
  }, [extraCharges]);

  // Process extra charges for submission
  const processExtraChargesForSubmission = useCallback(() => {
    return extraCharges
      .filter(charge => charge.name && charge.price && charge.name.trim() !== '')
      .map(charge => ({
        name: charge.name,
        price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
      }));
  }, [extraCharges]);

  return {
    extraCharges,
    setExtraCharges,
    handleAddExtraCharge,
    handleRemoveExtraCharge,
    handleExtraChargeChange,
    processExtraChargesForSubmission
  };
}
