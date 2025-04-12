
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Home } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface LocationStepProps {
  clients: any;
  collaborators: any;
  formState: any;
  serviceType: string;
}

export function LocationStep({ clients, collaborators, formState, serviceType }: LocationStepProps) {
  const { control, watch, setValue, trigger } = useFormContext();
  
  // Re-trigger validation when service type changes
  useEffect(() => {
    // Clear fields that are not relevant for the current service type
    if (serviceType === 'transfer') {
      setValue('hours', '');
    } else if (serviceType === 'dispo') {
      setValue('destination', '');
    }
    
    // Trigger validation for the fields
    trigger(['origin', 'destination', 'hours']);
  }, [serviceType, setValue, trigger]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Tipo de servicio y ubicación</h2>
        <p className="text-muted-foreground mt-1">
          Selecciona el tipo de servicio e indica los detalles de ubicación
        </p>
      </div>

      <FormField
        control={control}
        name="serviceType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo de servicio *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
                value={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Transfer (Punto a punto)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dispo" id="dispo" />
                  <Label htmlFor="dispo" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Disposición (Por horas)
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {serviceType === 'transfer' && (
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
      )}

      {serviceType === 'dispo' && (
        <div className="space-y-4">
          <FormField
            control={control}
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
            control={control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horas contratadas *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    step="1" 
                    placeholder="4" 
                    {...field} 
                    className="w-full" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
