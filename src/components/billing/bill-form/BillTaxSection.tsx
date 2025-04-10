
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';

interface BillTaxSectionProps {
  form: UseFormReturn<any>;
}

export function BillTaxSection({ form }: BillTaxSectionProps) {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="taxRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IVA (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step="0.1" 
                {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="taxApplication"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Aplicación del IVA</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excluded" id="tax-excluded" />
                  <Label htmlFor="tax-excluded">Añadir IVA al precio (10€ + 10% = 11€)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="included" id="tax-included" />
                  <Label htmlFor="tax-included">IVA incluido en el precio (10€ incluye 10% IVA)</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
