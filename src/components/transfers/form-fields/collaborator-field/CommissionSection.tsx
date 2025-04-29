
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BadgePercent, DollarSign } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export function CommissionSection() {
  const form = useFormContext();
  const commissionType = form.watch('commissionType');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <FormField
        control={form.control}
        name="commissionType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo de comisión</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
                value={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="flex items-center">
                    <BadgePercent className="h-4 w-4 mr-1.5" />
                    Porcentaje (%)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1.5" />
                    Cantidad fija (€)
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="commission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Valor de comisión ({commissionType === 'percentage' ? '%' : '€'})
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step={commissionType === 'percentage' ? "1" : "0.01"}
                placeholder={commissionType === 'percentage' ? "10" : "25.00"}
                {...field}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
