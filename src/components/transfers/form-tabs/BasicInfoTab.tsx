
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormProvider } from 'react-hook-form';
import { DateTimeFields } from '../form-fields/DateTimeFields';
import { ClientField } from '../form-fields/ClientField';
import { Client } from '@/types/client';
import { TransferFormValues } from '../schema/transferSchema';

interface BasicInfoTabProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
  clients: Client[];
}

export function BasicInfoTab({ 
  form, 
  serviceType, 
  clients
}: BasicInfoTabProps) {
  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <DateTimeFields form={form} />
        
        {serviceType === 'transfer' ? (
          <>
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lugar de recogida *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Aeropuerto de Ibiza" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lugar de destino *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Hotel Ushuaïa" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Punto de inicio *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Hotel Ushuaïa" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas contratadas *</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" placeholder="4" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <ClientField form={form} clients={clients} />
      </div>
    </FormProvider>
  );
}
