
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useExtraCharges } from '../hooks/useExtraCharges';

interface ExtraChargesStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function ExtraChargesStep({ formState }: ExtraChargesStepProps) {
  const { control, watch, setValue } = useFormContext();
  const extraCharges = watch('extraCharges') || [];
  
  // Extra charges functions from hook
  const { 
    handleAddExtraCharge,
    handleRemoveExtraCharge,
    handleExtraChargeChange
  } = useExtraCharges(extraCharges);

  const handleAddCharge = () => {
    const updatedCharges = handleAddExtraCharge();
    setValue('extraCharges', updatedCharges);
  };

  const handleRemoveCharge = (index: number) => {
    const newExtraCharges = handleRemoveExtraCharge(index);
    setValue('extraCharges', newExtraCharges);
  };

  const handleUpdateCharge = (index: number, field: string, value: string) => {
    const newExtraCharges = handleExtraChargeChange(index, field as any, value);
    setValue('extraCharges', newExtraCharges);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Cargos adicionales</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Añade cualquier cargo adicional relacionado con este servicio
      </p>
      
      <div className="space-y-4">
        {extraCharges && extraCharges.length > 0 ? (
          extraCharges.map((charge: any, index: number) => (
            <div key={charge.id || index} className="bg-secondary/20 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7">
                  <label className="text-sm font-medium">Concepto</label>
                  <input 
                    className="w-full mt-1 border rounded px-3 py-2"
                    placeholder="Ej: Silla de bebé" 
                    value={charge.name || ''}
                    onChange={(e) => handleUpdateCharge(index, 'name', e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm font-medium">Precio (€)</label>
                  <input 
                    className="w-full mt-1 border rounded px-3 py-2"
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="10.00" 
                    value={charge.price || ''}
                    onChange={(e) => handleUpdateCharge(index, 'price', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button 
                    type="button" 
                    className="w-full h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
                    onClick={() => handleRemoveCharge(index)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">No hay cargos extra. Haz clic en "Añadir cargo" para agregar uno.</p>
          </div>
        )}
        
        <button 
          type="button" 
          className="w-full py-2 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
          onClick={handleAddCharge}
        >
          Añadir cargo
        </button>
      </div>
    </div>
  );
}
