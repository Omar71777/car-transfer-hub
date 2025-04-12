
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TransferFormValues } from '../schema/transferSchema';
import { Collaborator, useCollaborators } from '@/hooks/useCollaborators';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CollaboratorForm } from '@/components/collaborators/CollaboratorForm';

interface CollaboratorFieldProps {
  form: UseFormReturn<TransferFormValues>;
}

export function CollaboratorField({ form }: CollaboratorFieldProps) {
  const { collaborators, addCollaborator } = useCollaborators();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCollaborator = async (values: any) => {
    const success = await addCollaborator(values);
    if (success) {
      form.setValue('collaborator', values.name);
      setIsAddDialogOpen(false);
    }
  };

  return (
    <>
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
                onClick={() => setIsAddDialogOpen(true)} 
                className="p-0 h-auto text-xs"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Nuevo
              </Button>
            </div>
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuevo Colaborador</DialogTitle>
          </DialogHeader>
          <CollaboratorForm onSubmit={handleAddCollaborator} initialValues={null} isEditing={false} />
        </DialogContent>
      </Dialog>
    </>
  );
}
