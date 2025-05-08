
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentStatusFieldProps {
  form: UseFormReturn<any>;
}

export const PaymentStatusField = ({ form }: PaymentStatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="paymentStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Estado de Pago</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || 'pending'}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="paid">Pagado</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
