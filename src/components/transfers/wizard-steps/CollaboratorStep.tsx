
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';
import { useTransferForm } from '../context/TransferFormContext';

interface CollaboratorStepProps {
  clients: any;
  collaborators: any;
  formState: any;
}

export function CollaboratorStep({ collaborators, formState }: CollaboratorStepProps) {
  const { control, watch, setValue } = useFormContext();
  const { setIsServicioPropio } = useTransferForm();
  
  const collaboratorValue = watch('collaborator');
  const commissionType = watch('commissionType');
  
  // Transform collaborators to format needed for select
  const collaboratorOptions = collaborators?.length 
    ? [...collaborators] 
    : [{ id: 'servicio propio', name: 'Servicio Propio' }];
  
  // Add generic option if no custom collaborators
  if (!collaboratorOptions.some(c => c.id === 'none')) {
    collaboratorOptions.push({ id: 'none', name: 'Seleccionar' });
  }
  
  const handleCollaboratorChange = (value: string) => {
    if (value === 'servicio propio') {
      setIsServicioPropio(true);
    } else {
      setIsServicioPropio(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Información del colaborador</h2>
        <p className="text-muted-foreground mt-1">
          ¿Quién realiza el servicio? Si lo realizas tú mismo, selecciona "Servicio Propio"
        </p>
      </div>
      
      <FormField
        control={control}
        name="collaborator"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proveedor del servicio</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleCollaboratorChange(value);
              }}
              value={field.value || 'none'}
              defaultValue="none"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar colaborador" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {collaboratorOptions.map((collaborator) => (
                  <SelectItem key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {collaboratorValue && collaboratorValue !== 'none' && collaboratorValue !== 'servicio propio' && (
        <div className="space-y-4">
          <FormField
            control={control}
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
                      <Label htmlFor="percentage">Porcentaje (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Cantidad fija (€)</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
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
      )}
    </div>
  );
}
