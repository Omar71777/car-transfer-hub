
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Transfer } from '@/types';
import { CollaboratorField } from './form-fields/CollaboratorField';
import { PaymentStatusField } from './form-fields/PaymentStatusField';
import { useCollaborators } from '@/hooks/useCollaborators';

const editFormSchema = z.object({
  price: z.string().min(1, { message: 'El precio es requerido' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: 'El precio debe ser un número positivo' }
  ),
  paymentStatus: z.enum(['paid', 'pending']),
  collaborator: z.string().optional(),
  commission: z.string().optional()
    .refine(
      (val) => val === undefined || val === '' || (!isNaN(Number(val)) && Number(val) >= 0), 
      { message: 'La comisión debe ser un número positivo o cero' }
    ),
  commissionType: z.enum(['percentage', 'fixed']).optional(),
});

type EditFormValues = z.infer<typeof editFormSchema>;

interface TransferEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EditFormValues) => void;
  transfer: Transfer;
}

export function TransferEditDialog({
  isOpen,
  onClose,
  onSubmit,
  transfer
}: TransferEditDialogProps) {
  const { collaborators } = useCollaborators();
  
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      price: transfer.price.toString(),
      paymentStatus: transfer.paymentStatus || 'pending',
      collaborator: transfer.collaborator || undefined,
      commission: transfer.commission ? transfer.commission.toString() : '',
      commissionType: transfer.commissionType || 'percentage',
    },
  });

  const handleSubmit = (values: EditFormValues) => {
    // Convert string values to numbers for submission
    const processedValues = {
      ...values,
      price: Number(values.price),
      commission: values.commission ? Number(values.commission) : undefined,
    };
    onSubmit(processedValues);
  };

  const paymentStatus = form.watch('paymentStatus');
  const hasCollaborator = !!form.watch('collaborator') && form.watch('collaborator') !== 'none';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Transfer</DialogTitle>
          <DialogDescription>
            Modifica los detalles del transfer seleccionado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <PaymentStatusField form={form} />
            </div>

            <CollaboratorField form={form} collaborators={collaborators} />

            {hasCollaborator && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comisión</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" min="0" max="100" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commissionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Comisión</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                          <SelectItem value="fixed">Cantidad fija (€)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
