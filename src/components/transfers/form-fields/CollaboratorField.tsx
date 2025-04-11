
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Collaborator } from '@/hooks/useCollaborators';

interface CollaboratorFieldProps {
  form: UseFormReturn<TransferFormValues>;
  collaborators: Collaborator[];
}

export function CollaboratorField({ form, collaborators }: CollaboratorFieldProps) {
  return (
    <FormField
      control={form.control}
      name="collaborator"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Colaborador (opcional)</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sin colaborador" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Sin colaborador</SelectItem>
              {collaborators && collaborators.length > 0 ? (
                collaborators.map((collaborator) => (
                  <SelectItem 
                    key={collaborator.id} 
                    value={collaborator.name || `collaborator-${collaborator.id}`}
                  >
                    {collaborator.name || `Colaborador ${collaborator.id}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-collaborators" disabled>
                  No hay colaboradores disponibles
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
