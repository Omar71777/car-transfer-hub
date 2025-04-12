
import { useState, useCallback } from 'react';

interface ExtraCharge {
  id?: string;
  name: string;
  price: string | number;
}

export function useExtraCharges(initialCharges: ExtraCharge[] = []) {
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>(initialCharges || []);
  
  // Add a new empty extra charge
  const handleAddExtraCharge = useCallback(() => {
    const newCharges = [...extraCharges, { name: '', price: '' }];
    setExtraCharges(newCharges);
    return newCharges;
  }, [extraCharges]);
  
  // Remove an extra charge at specified index
  const handleRemoveExtraCharge = useCallback((index: number) => {
    const newCharges = extraCharges.filter((_, i) => i !== index);
    setExtraCharges(newCharges);
    return newCharges;
  }, [extraCharges]);
  
  // Update a field in an extra charge
  const handleExtraChargeChange = useCallback((index: number, field: keyof ExtraCharge, value: string) => {
    const newCharges = [...extraCharges];
    newCharges[index] = {
      ...newCharges[index],
      [field]: value
    };
    setExtraCharges(newCharges);
    return newCharges;
  }, [extraCharges]);
  
  // Process extra charges for form submission
  const processExtraChargesForSubmission = useCallback(() => {
    return extraCharges
      .filter(charge => charge.name && charge.price)
      .map(charge => ({
        id: charge.id,
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
