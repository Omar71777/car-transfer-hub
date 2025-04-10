
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BanknoteIcon } from 'lucide-react';

interface PricingStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function PricingStep({ clients, collaborators, formState }: PricingStepProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BanknoteIcon className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">¿Cuál es el precio del transfer?</h2>
        <p className="text-muted-foreground mt-1">
          Indica el precio y si ya ha sido pagado
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio (€) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="120.00" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Estado de Pago *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  value={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid">Cobrado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pending" id="pending" />
                    <Label htmlFor="pending">Pendiente de Pago</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="collaborator"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>¿Es un servicio de colaborador?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value !== '' && field.value !== 'none' ? 'yes' : 'no'}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="has-collaborator" />
                    <Label htmlFor="has-collaborator">Sí, lo hemos recibido de un colaborador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-collaborator" />
                    <Label htmlFor="no-collaborator">No, es un servicio propio</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
