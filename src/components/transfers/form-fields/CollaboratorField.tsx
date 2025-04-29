
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collaborator } from '@/hooks/useCollaborators';
import { Button } from '@/components/ui/button';
import { PlusCircle, BadgePercent, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CollaboratorForm, CollaboratorFormValues } from '@/components/collaborators/CollaboratorForm';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCollaboratorCreation } from '@/hooks/collaborator/useCollaboratorCreation';
import { useTransferForm } from '../context/TransferFormContext';

export interface CollaboratorFieldProps {
  collaborators: Collaborator[];
  onCollaboratorCreated?: () => Promise<void>;
}

export function CollaboratorField({ collaborators, onCollaboratorCreated }: CollaboratorFieldProps) {
  const form = useFormContext();
  const { setIsServicioPropio } = useTransferForm();
  
  const {
    isNewCollaboratorDialogOpen,
    setIsNewCollaboratorDialogOpen,
    collaboratorName,
    setCollaboratorName,
    collaboratorPhone,
    setCollaboratorPhone,
    collaboratorEmail,
    setCollaboratorEmail,
    isCreatingCollaborator,
    createError,
    handleAddNewCollaborator,
    handleNewCollaboratorSubmit,
    dialogStatus
  } = useCollaboratorCreation({
    onSuccess: onCollaboratorCreated
  });
  
  const collaboratorValue = form.watch('collaborator');
  const commissionType = form.watch('commissionType');

  const handleCollaboratorChange = (value: string) => {
    if (value === 'servicio propio') {
      setIsServicioPropio(true);
    } else {
      setIsServicioPropio(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onClick={handleAddNewCollaborator} 
                  className="p-0 h-auto text-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  Nuevo
                </Button>
              </div>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCollaboratorChange(value);
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
      </div>

      {/* Commission Section - only display if a collaborator is selected and it's not "none" and not "servicio propio" */}
      {collaboratorValue && collaboratorValue !== 'none' && collaboratorValue !== 'servicio propio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField
            control={form.control}
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
                      <Label htmlFor="percentage" className="flex items-center">
                        <BadgePercent className="h-4 w-4 mr-1.5" />
                        Porcentaje (%)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed" className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1.5" />
                        Cantidad fija (€)
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
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

      <Dialog open={isNewCollaboratorDialogOpen} onOpenChange={setIsNewCollaboratorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuevo Colaborador</DialogTitle>
          </DialogHeader>
          {dialogStatus === 'idle' ? (
            <CollaboratorForm 
              onSubmit={handleNewCollaboratorSubmit}
              initialValues={{
                id: '', // Add the id property to satisfy the type requirement
                name: collaboratorName,
                phone: collaboratorPhone,
                email: collaboratorEmail
              }}
              isEditing={false} 
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Creando colaborador...</span>
            </div>
          )}
          {createError && (
            <div className="text-destructive text-sm mt-2">{createError}</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
