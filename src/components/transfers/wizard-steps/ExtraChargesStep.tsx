
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ExtraChargesForm } from '../form-fields/ExtraChargesForm';

interface ExtraChargesStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function ExtraChargesStep({ formState }: ExtraChargesStepProps) {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Cargos adicionales</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Añade cualquier cargo adicional relacionado con este servicio
      </p>
      
      <ExtraChargesForm control={control} />
    </div>
  );
}
