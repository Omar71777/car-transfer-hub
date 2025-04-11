
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Collaborator } from '@/hooks/useCollaborators';
import { Users } from 'lucide-react';
import { calculateCommissionAmount } from '@/lib/calculations';

interface CollaboratorStepProps {
  clients: any;
  collaborators: Collaborator[];
  formState: any;
}

export function CollaboratorStep({ clients, collaborators, formState }: CollaboratorStepProps) {
  const { control, watch, setValue } = useFormContext();
  
  const commissionType = watch('commissionType');
  const price = watch('price');
  const commission = watch('commission');
  
  // If we arrived at this step, ensure a collaborator is set, but only if collaborators exist
  useEffect(() => {
    const currentCollaborator = watch('collaborator');
    
    // Only set a default collaborator if there are collaborators and none is selected
    if ((!currentCollaborator || currentCollaborator === 'none') && 
        collaborators && collaborators.length > 0) {
      setValue('collaborator', collaborators[0].name);
    } else if ((!currentCollaborator || currentCollaborator === '') && 
              (!collaborators || collaborators.length === 0)) {
      setValue('collaborator', 'none');
    }
  }, [collaborators, setValue, watch]);
  
  // Calculate the equivalent value based on the opposite commission type
  const getEquivalentValue = () => {
    if (!price || !commission) return null;
    
    const priceNum = Number(price);
    const commissionNum = Number(commission);
    
    if (isNaN(priceNum) || isNaN(commissionNum) || priceNum <= 0) return null;
    
    if (commissionType === 'percentage') {
      // Calculate the fixed amount equivalent to the percentage
      const fixedAmount = (priceNum * commissionNum) / 100;
      return `${fixedAmount.toFixed(2)}€`;
    } else {
      // Calculate the percentage equivalent to the fixed amount
      const percentage = (commissionNum / priceNum) * 100;
      return `${percentage.toFixed(1)}%`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="mx-auto h-12 w-12 text-primary opacity-80 mb-3" />
        <h2 className="text-xl font-semibold">Información del colaborador</h2>
        <p className="text-muted-foreground mt-1">
          Selecciona el colaborador y su comisión
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="collaborator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colaborador *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar colaborador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sin colaborador</SelectItem>
                  {collaborators && collaborators.length > 0 ? (
                    collaborators.map((collaborator) => (
                      <SelectItem key={collaborator.id} value={collaborator.name}>
                        {collaborator.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No hay colaboradores disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Comisión</FormLabel>
          
          <FormField
            control={control}
            name="commissionType"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
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
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max={commissionType === 'percentage' ? "100" : undefined} 
                    step={commissionType === 'percentage' ? "0.1" : "0.01"} 
                    placeholder={commissionType === 'percentage' ? "10.0" : "25.00"} 
                    {...field} 
                  />
                </FormControl>
                {commission && price && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Equivalente a: {getEquivalentValue()}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>
      </div>
    </div>
  );
}
