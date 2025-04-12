
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BanknoteIcon, Percent } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

export interface PricingFieldsProps {
  serviceType: string;
}

export function PricingFields({ serviceType }: PricingFieldsProps) {
  const { control, watch, setValue } = useFormContext();
  const discountType = watch('discountType');

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio{serviceType === 'dispo' ? ' por hora' : ''} (€) *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="120.00" 
                {...field} 
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {serviceType === 'dispo' && (
        <div className="text-sm text-muted-foreground">
          <p>
            Precio total para {watch('hours') || 0} horas: €{((Number(watch('price')) || 0) * (Number(watch('hours')) || 0)).toFixed(2)}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <FormLabel>Descuento (opcional)</FormLabel>
        <FormField
          control={control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value === "no-discount" ? null : value);
                }} 
                value={field.value || "no-discount"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de descuento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no-discount">Sin descuento</SelectItem>
                  <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                  <SelectItem value="fixed">Monto fijo (€)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {discountType && discountType !== "no-discount" && (
          <FormField
            control={control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0" 
                      max={discountType === 'percentage' ? "100" : undefined}
                      step={discountType === 'percentage' ? "1" : "0.01"} 
                      placeholder={discountType === 'percentage' ? "10" : "25.00"} 
                      {...field} 
                      className="w-full"
                    />
                    {discountType === 'percentage' && (
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
