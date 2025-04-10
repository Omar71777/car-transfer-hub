
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function LocationStep({ clients, collaborators, formState }: LocationStepProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">¿Dónde se recogerá y dejará al cliente?</h2>
        <p className="text-muted-foreground mt-1">
          Indica los lugares de origen y destino del transfer
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
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
          control={control}
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
      </div>
    </div>
  );
}
