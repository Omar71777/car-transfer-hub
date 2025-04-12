
import React from 'react';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { ExtraCharge } from '@/types';

interface ExtraChargesFormProps {
  extraCharges: Partial<ExtraCharge>[];
  onAddCharge: () => void;
  onRemoveCharge: (index: number) => void;
  onChangeCharge: (index: number, field: string, value: string) => void;
}

export function ExtraChargesForm({
  extraCharges,
  onAddCharge,
  onRemoveCharge,
  onChangeCharge
}: ExtraChargesFormProps) {
  return (
    <div className="space-y-4">
      {extraCharges && extraCharges.length > 0 ? (
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
                        value={charge.name || ''}
                        onChange={(e) => onChangeCharge(index, 'name', e.target.value)}
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
                        value={charge.price || ''}
                        onChange={(e) => onChangeCharge(index, 'price', e.target.value)}
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
                    onClick={() => onRemoveCharge(index)}
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
        onClick={onAddCharge}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Añadir cargo
      </Button>
    </div>
  );
}
