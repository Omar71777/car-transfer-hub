
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PlusCircle, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useExtraCharges } from '../hooks/useExtraCharges';

interface ExtraChargesStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function ExtraChargesStep({ clients, collaborators, formState }: ExtraChargesStepProps) {
  const { setValue, getValues } = useFormContext();
  const extraCharges = getValues('extraCharges') || [];
  
  const {
    handleAddExtraCharge,
    handleRemoveExtraCharge,
    handleExtraChargeChange,
    processExtraChargesForSubmission
  } = useExtraCharges(extraCharges);
  
  const handleAddCharge = () => {
    const updatedCharges = handleAddExtraCharge();
    setValue('extraCharges', updatedCharges);
  };
  
  const handleRemoveCharge = (index: number) => {
    const updatedCharges = handleRemoveExtraCharge(index);
    setValue('extraCharges', updatedCharges);
  };
  
  const handleUpdateCharge = (index: number, field: string, value: string) => {
    const updatedCharges = handleExtraChargeChange(index, field as any, value);
    setValue('extraCharges', updatedCharges);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Receipt className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Cargos adicionales</h2>
        <p className="text-muted-foreground mt-1">
          Agrega cualquier cargo extra que quieras incluir en este servicio
        </p>
      </div>
      
      <div className="space-y-4">
        {extraCharges.map((charge: any, index: number) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <FormItem>
                <FormLabel className="text-xs">Concepto</FormLabel>
                <Input
                  value={charge.name || ''}
                  onChange={(e) => handleUpdateCharge(index, 'name', e.target.value)}
                  placeholder="Ej: Equipaje extra"
                  className="w-full"
                />
              </FormItem>
            </div>
            
            <div className="w-24">
              <FormItem>
                <FormLabel className="text-xs">Precio (€)</FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={charge.price || ''}
                  onChange={(e) => handleUpdateCharge(index, 'price', e.target.value)}
                  placeholder="10.00"
                  className="w-full"
                />
              </FormItem>
            </div>
            
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="mt-7"
              onClick={() => handleRemoveCharge(index)}
            >
              ✕
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCharge}
          className="w-full mt-4"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Agregar cargo extra
        </Button>
      </div>
    </div>
  );
}
