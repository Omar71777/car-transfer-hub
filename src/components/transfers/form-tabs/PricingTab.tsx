
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentStatusField } from '../form-fields/PaymentStatusField';
import { PricingFields } from '../form-fields/PricingFields';
import { TransferFormValues } from '../schema/transferSchema';

interface PricingTabProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
}

export function PricingTab({ form, serviceType }: PricingTabProps) {
  const hours = form.watch('hours');
  const price = form.watch('price');
  
  // Calculate total price for dispo services
  const calculateTotalPrice = () => {
    if (serviceType !== 'dispo' || !hours || !price) return price;
    return (Number(price) * Number(hours)).toFixed(2);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
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
          control={form.control}
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
        
        {form.watch('discountType') && (
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max={form.watch('discountType') === 'percentage' ? "100" : undefined}
                    step={form.watch('discountType') === 'percentage' ? "1" : "0.01"} 
                    placeholder={form.watch('discountType') === 'percentage' ? "10" : "25.00"} 
                    {...field} 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      
      <PaymentStatusField form={form} />
      
      <PricingFields form={form} serviceType={serviceType} />
    </div>
  );
}
