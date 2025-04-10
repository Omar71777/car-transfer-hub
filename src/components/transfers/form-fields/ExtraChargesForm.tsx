
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface ExtraCharge {
  id?: string;
  name?: string;
  price?: string | number;
}

interface ExtraChargesFormProps {
  extraCharges: Partial<ExtraCharge>[];
  onAddCharge: () => void;
  onRemoveCharge: (index: number) => void;
  onChangeCharge: (index: number, field: keyof ExtraCharge, value: any) => void;
}

export function ExtraChargesForm({
  extraCharges,
  onAddCharge,
  onRemoveCharge,
  onChangeCharge
}: ExtraChargesFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Cargos adicionales</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddCharge}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Añadir cargo
        </Button>
      </div>
      
      {extraCharges.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">No hay cargos adicionales. Haz clic en "Añadir cargo" para agregar uno.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {extraCharges.map((charge, index) => (
            <Card key={charge.id || index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7">
                    <Label htmlFor={`charge-name-${index}`}>Concepto</Label>
                    <Input
                      id={`charge-name-${index}`}
                      value={charge.name || ''}
                      onChange={(e) => onChangeCharge(index, 'name', e.target.value)}
                      placeholder="Ej: Silla de bebé, Tiempo de espera, etc."
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor={`charge-price-${index}`}>Precio (€)</Label>
                    <Input
                      id={`charge-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={charge.price || ''}
                      onChange={(e) => onChangeCharge(index, 'price', e.target.value)}
                      placeholder="10.00"
                      className="mt-1"
                    />
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
          ))}
        </div>
      )}
    </div>
  );
}
