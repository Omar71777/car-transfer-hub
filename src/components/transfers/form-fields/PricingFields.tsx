
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BanknoteIcon, Percent } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingFieldsProps {
  serviceType: string;
}

export function PricingFields({ serviceType }: PricingFieldsProps) {
  const { control, watch, setValue } = useFormContext();
  const price = watch('price');
  const hours = watch('hours');
  const discountType = watch('discountType');
  
  // Calculate total price for dispo services
  const calculateTotalPrice = () => {
    if (serviceType !== 'dispo' || !hours || !price) return price;
    return (Number(price) * Number(hours)).toFixed(2);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BanknoteIcon className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Información de precio</h2>
        <p className="text-muted-foreground mt-1">
          Indica el precio {serviceType === 'dispo' ? 'por hora' : 'del transfer'} y los descuentos aplicados
        </p>
      </div>

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
      
      {serviceType === 'dispo' && hours && price && (
        <div className="text-sm text-muted-foreground">
          <p>
            Precio total para {hours} horas: €{calculateTotalPrice()}
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
        
        {discountType && (
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
