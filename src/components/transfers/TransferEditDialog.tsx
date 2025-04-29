
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Transfer } from '@/types';
import { CollaboratorField } from './form-fields/CollaboratorField';
import { PaymentStatusField } from './form-fields/PaymentStatusField';
import { PaymentMethodIcon } from './PaymentMethodIcon';
import { useDialog } from '@/components/ui/dialog-service';

const editFormSchema = z.object({
  price: z.string().min(1, { message: 'El precio es requerido' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: 'El precio debe ser un número positivo' }
  ),
  paymentStatus: z.enum(['paid', 'pending']),
  payment_method: z.enum(['card', 'cash', 'bank_transfer']).nullable(),
  collaborator: z.string().optional(),
  commission: z.string().optional()
    .refine(
      (val) => val === undefined || val === '' || (!isNaN(Number(val)) && Number(val) >= 0), 
      { message: 'La comisión debe ser un número positivo o cero' }
    ),
  commissionType: z.enum(['percentage', 'fixed']).optional(),
});

type EditFormValues = z.infer<typeof editFormSchema>;

// Component for the edit dialog content
export function TransferEditContent({
  onSubmit,
  onClose,
  transfer
}: {
  onSubmit: (values: EditFormValues) => void;
  onClose: () => void;
  transfer: Transfer;
}) {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      price: transfer.price.toString(),
      paymentStatus: transfer.paymentStatus || 'pending',
      payment_method: transfer.payment_method || null,
      collaborator: transfer.collaborator || undefined,
      commission: transfer.commission ? transfer.commission.toString() : '',
      commissionType: transfer.commissionType || 'percentage',
    },
  });

  const handleSubmit = (values: EditFormValues) => {
    onSubmit(values);
    onClose();
  };

  const paymentStatus = form.watch('paymentStatus');
  const hasCollaborator = !!form.watch('collaborator') && form.watch('collaborator') !== 'none';

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Transfer</DialogTitle>
        <DialogDescription>
          Modifica los detalles del transfer seleccionado.
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
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

            <PaymentStatusField />
          </div>

          <CollaboratorField collaborators={[]} />

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
      </FormProvider>
    </>
  );
}

// Function to open the dialog using the dialog service
export function openTransferEditDialog(
  dialogService: ReturnType<typeof useDialog>,
  onSubmit: (values: EditFormValues) => void,
  transfer: Transfer
) {
  const { openDialog, closeDialog } = dialogService;
  
  openDialog(
    <TransferEditContent
      onSubmit={onSubmit}
      onClose={closeDialog}
      transfer={transfer}
    />,
    {
      width: 'md',
      preventOutsideClose: false,
      onClose: () => {
        console.log('Edit dialog closed');
        document.body.style.pointerEvents = 'auto';
      }
    }
  );
}

// Legacy component for backward compatibility
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
  const dialogService = useDialog();
  
  React.useEffect(() => {
    if (isOpen && transfer) {
      openTransferEditDialog(dialogService, onSubmit, transfer);
    }
  }, [isOpen, transfer, dialogService]);
  
  return null;
}
