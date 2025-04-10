
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PackagePlus } from 'lucide-react';
import { ExtraChargesForm } from '../form-fields/ExtraChargesForm';
import { useExtraCharges } from '../hooks/useExtraCharges';

interface ExtraChargesStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function ExtraChargesStep({ clients, collaborators, formState }: ExtraChargesStepProps) {
  const { watch, setValue } = useFormContext();
  const extraCharges = watch('extraCharges') || [];
  
  const { 
    handleAddExtraCharge,
    handleRemoveExtraCharge,
    handleExtraChargeChange
  } = useExtraCharges(extraCharges);

  const handleAddCharge = () => {
    const updatedCharges = handleAddExtraCharge();
    setValue('extraCharges', updatedCharges);
    console.log('Added new charge. Updated charges:', updatedCharges);
  };

  const handleRemoveCharge = (index: number) => {
    const newExtraCharges = handleRemoveExtraCharge(index, extraCharges);
    setValue('extraCharges', newExtraCharges);
    console.log('Removed charge at index', index, 'Updated charges:', newExtraCharges);
  };

  const handleUpdateCharge = (index: number, field: string, value: string) => {
    const newExtraCharges = handleExtraChargeChange(index, field as any, value, extraCharges);
    setValue('extraCharges', newExtraCharges);
    console.log(`Updated ${field} to ${value} for charge at index ${index}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <PackagePlus className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Cargos extra (opcional)</h2>
        <p className="text-muted-foreground mt-1">
          Añade cargos adicionales como tiempo de espera, silla de bebé, etc.
        </p>
      </div>

      <ExtraChargesForm
        extraCharges={extraCharges}
        onAddCharge={handleAddCharge}
        onRemoveCharge={handleRemoveCharge}
        onChangeCharge={handleUpdateCharge}
      />
    </div>
  );
}
