import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
interface PricingFieldsProps {
  form: UseFormReturn<TransferFormValues>;
}
export function PricingFields({
  form
}: PricingFieldsProps) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField control={form.control} name="price" render={({
      field
    }) => <FormItem>
            <FormLabel>Precio (€)</FormLabel>
            <FormControl>
              <Input type="number" min="0" step="0.01" placeholder="120.00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />
      
      <FormField control={form.control} name="commission" render={({
      field
    }) => <FormItem>
            <FormLabel>Comisión (%)</FormLabel>
            <FormControl>
              <Input type="number" min="0" max="100" step="0.1" placeholder="10.0" className="" />
            </FormControl>
            <FormMessage />
          </FormItem>} />
    </div>;
}