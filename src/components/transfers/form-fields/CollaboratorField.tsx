
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collaborator } from '@/hooks/useCollaborators';
import { Button } from '@/components/ui/button';
import { PlusCircle, UserPlus, BadgePercent, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CollaboratorForm } from '@/components/collaborators/CollaboratorForm';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface CollaboratorFieldProps {
  collaborators: Collaborator[];
}

export function CollaboratorField({ collaborators }: CollaboratorFieldProps) {
  const form = useFormContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const collaboratorValue = form.watch('collaborator');
  const commissionType = form.watch('commissionType');

  const handleAddCollaborator = async (values: any) => {
    // This is just a placeholder since we don't have access to addCollaborator here
    console.log('Adding collaborator:', values);
    form.setValue('collaborator', values.name);
    setIsAddDialogOpen(false);
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
