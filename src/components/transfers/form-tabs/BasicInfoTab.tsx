
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormProvider } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DateTimeFields } from '../form-fields/DateTimeFields';
import { ClientField } from '../form-fields/ClientField';
import { CollaboratorField } from '../form-fields/CollaboratorField';
import { Client } from '@/types/client';
import { TransferFormValues } from '../schema/transferSchema';

interface BasicInfoTabProps {
  form: UseFormReturn<TransferFormValues>;
  serviceType: 'transfer' | 'dispo';
  setServiceType: (type: 'transfer' | 'dispo') => void;
  clients: Client[];
}

export function BasicInfoTab({ 
  form, 
  serviceType, 
  setServiceType, 
  clients
}: BasicInfoTabProps) {
  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de servicio *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setServiceType(value as 'transfer' | 'dispo');
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  value={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer-type" />
                    <Label htmlFor="transfer-type">Transfer (Punto a punto)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dispo" id="dispo-type" />
                    <Label htmlFor="dispo-type">Disposición (Por horas)</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClientField form={form} clients={clients} />
          <CollaboratorField collaborators={[]} />
        </div>
      </div>
    </FormProvider>
  );
}
