
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Collaborator } from '@/hooks/useCollaborators';
import { CommissionSection } from './CommissionSection';
import { CollaboratorDialog } from './CollaboratorDialog';
import { useCollaboratorCreation } from '@/hooks/collaborator/useCollaboratorCreation';

export interface CollaboratorFieldProps {
  collaborators?: Array<Collaborator>;
  onCollaboratorCreated?: () => Promise<void>;
}

export function CollaboratorField({ 
  collaborators = [], 
  onCollaboratorCreated
}: CollaboratorFieldProps) {
  const { control, watch, setValue } = useFormContext();
  const collaboratorValue = watch('collaborator');
  
  const {
    isNewCollaboratorDialogOpen,
    setIsNewCollaboratorDialogOpen,
    createError,
    isCreatingCollaborator,
    handleNewCollaboratorSubmit,
    dialogStatus
  } = useCollaboratorCreation({ onSuccess: onCollaboratorCreated });

  const hasCollaborator = !!collaboratorValue && collaboratorValue !== 'none';
  const isServicioPropio = collaboratorValue === 'servicio propio';

  // Handle "Servicio Propio" selection
  const handleServicioPropioChange = (isChecked: boolean) => {
    if (isChecked) {
      setValue('collaborator', 'servicio propio');
      setValue('commission', '0');
    } else {
      setValue('collaborator', '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Colaborador</FormLabel>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsNewCollaboratorDialogOpen(true)}
          className="h-8 px-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Nuevo colaborador
        </Button>
      </div>

      <FormField
        control={control}
        name="collaborator"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset commission when switching collaborators
                  if (value !== field.value) {
                    setValue('commission', '');
                  }
                }}
                value={field.value || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar colaborador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin colaborador</SelectItem>
                  <SelectItem value="servicio propio">Servicio propio</SelectItem>
                  {collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={collaborator.id}>
                      {collaborator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {hasCollaborator && !isServicioPropio && (
        <CommissionSection />
      )}

      <CollaboratorDialog
        isOpen={isNewCollaboratorDialogOpen}
        setIsOpen={setIsNewCollaboratorDialogOpen}
        onSubmit={handleNewCollaboratorSubmit}
        isCreating={isCreatingCollaborator}
        createError={createError}
        initialValues={{}}
        dialogStatus={dialogStatus}
      />
    </div>
  );
}
