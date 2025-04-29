
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collaborator } from '@/hooks/useCollaborators';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface CollaboratorSelectProps {
  collaborators: Collaborator[];
  onAddNew: () => void;
  onChange: (value: string) => void;
}

export function CollaboratorSelect({ collaborators, onAddNew, onChange }: CollaboratorSelectProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="collaborator"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Colaborador (opcional)</FormLabel>
            <Button 
              type="button" 
              variant="link" 
              onClick={onAddNew} 
              className="p-0 h-auto text-xs"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Nuevo
            </Button>
          </div>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onChange(value);
            }} 
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
              <SelectItem value="servicio propio">Servicio Propio</SelectItem>
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
