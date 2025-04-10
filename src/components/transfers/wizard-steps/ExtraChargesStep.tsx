
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, PackagePlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

interface ExtraChargesStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function ExtraChargesStep({ clients, collaborators, formState }: ExtraChargesStepProps) {
  const { control, watch, setValue } = useFormContext();
  const extraCharges = watch('extraCharges') || [];

  const handleAddCharge = () => {
    setValue('extraCharges', [
      ...extraCharges,
      { id: uuidv4(), name: '', price: '' }
    ]);
  };

  const handleRemoveCharge = (index: number) => {
    const newExtraCharges = [...extraCharges];
    newExtraCharges.splice(index, 1);
    setValue('extraCharges', newExtraCharges);
  };

  const handleUpdateCharge = (index: number, field: string, value: string) => {
    const newExtraCharges = [...extraCharges];
    newExtraCharges[index][field] = value;
    setValue('extraCharges', newExtraCharges);
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

      <div className="space-y-4">
        {extraCharges.length > 0 ? (
          extraCharges.map((charge: any, index: number) => (
            <Card key={charge.id || index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7">
                    <FormItem>
                      <FormLabel>Concepto</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Silla de bebé" 
                          value={charge.name}
                          onChange={(e) => handleUpdateCharge(index, 'name', e.target.value)}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <div className="md:col-span-3">
                    <FormItem>
                      <FormLabel>Precio (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="10.00" 
                          value={charge.price}
                          onChange={(e) => handleUpdateCharge(index, 'price', e.target.value)}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleRemoveCharge(index)}
                      className="w-full h-10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar cargo</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">No hay cargos extra. Haz clic en "Añadir cargo" para agregar uno.</p>
          </div>
        )}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddCharge}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir cargo
        </Button>
      </div>
    </div>
  );
}
