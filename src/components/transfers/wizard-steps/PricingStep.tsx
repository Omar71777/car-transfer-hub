
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BanknoteIcon, Percent, PercentCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function PricingStep({ clients, collaborators, formState }: PricingStepProps) {
  const { control, watch, setValue } = useFormContext();
  const discountType = watch('discountType');
  const extraCharges = watch('extraCharges') || [];
  const serviceType = watch('serviceType');
  const collaboratorValue = watch('collaborator');

  // Calculate total extra charges
  const totalExtraCharges = extraCharges.reduce((sum: number, charge: any) => {
    return sum + (Number(charge.price) || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BanknoteIcon className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Información de pago</h2>
        <p className="text-muted-foreground mt-1">
          Indica el precio {serviceType === 'dispo' ? 'por hora' : 'del transfer'}, descuentos y estado de pago
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio{serviceType === 'dispo' ? ' por hora' : ''} (€) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="120.00" 
                  {...field} 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {serviceType === 'dispo' && (
          <div className="text-sm text-muted-foreground">
            <p>
              Precio total para {watch('hours') || 0} horas: €{((Number(watch('price')) || 0) * (Number(watch('hours')) || 0)).toFixed(2)}
            </p>
          </div>
        )}

        {extraCharges.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p>Cargos extra: €{totalExtraCharges.toFixed(2)}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <FormLabel>Descuento (opcional)</FormLabel>
          <FormField
            control={control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value === "no-discount" ? null : value);
                    console.log('Selected discount type:', value);
                  }} 
                  value={field.value || "no-discount"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de descuento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no-discount">Sin descuento</SelectItem>
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="fixed">Monto fijo (€)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {discountType && discountType !== "no-discount" && (
            <FormField
              control={control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        min="0" 
                        max={discountType === 'percentage' ? "100" : undefined}
                        step={discountType === 'percentage' ? "1" : "0.01"} 
                        placeholder={discountType === 'percentage' ? "10" : "25.00"} 
                        {...field} 
                        className="w-full"
                      />
                      {discountType === 'percentage' && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
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
                  onValueChange={(value) => {
                    field.onChange(value === 'yes' ? '' : 'none');
                    console.log('Collaborator selection:', value, 'Field value will be:', value === 'yes' ? '' : 'none');
                  }}
                  value={field.value !== 'none' ? 'yes' : 'no'}
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
