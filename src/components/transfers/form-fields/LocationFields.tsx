
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';

interface LocationFieldsProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
}

export function LocationFields({ form, serviceType }: LocationFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="origin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origen</FormLabel>
            <FormControl>
              <Input placeholder="Aeropuerto de Ibiza" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {serviceType === 'transfer' && (
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destino</FormLabel>
              <FormControl>
                <Input placeholder="Hotel Ushuaïa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {serviceType === 'dispo' && (
        <FormField
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas</FormLabel>
              <FormControl>
                <Input type="number" min="1" placeholder="4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
