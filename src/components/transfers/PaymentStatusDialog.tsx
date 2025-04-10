
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Collaborator } from '@/hooks/useCollaborators';

const paymentStatusSchema = z.object({
  paymentStatus: z.enum(['cobrado', 'a_cobrar']),
  paymentCollaborator: z.string().optional(),
});

type PaymentStatusFormValues = z.infer<typeof paymentStatusSchema>;

interface PaymentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PaymentStatusFormValues) => void;
  collaborators: Collaborator[];
}

export function PaymentStatusDialog({ open, onOpenChange, onSubmit, collaborators }: PaymentStatusDialogProps) {
  const form = useForm<PaymentStatusFormValues>({
    resolver: zodResolver(paymentStatusSchema),
    defaultValues: {
      paymentStatus: 'cobrado',
    },
  });

  const watchPaymentStatus = form.watch('paymentStatus');
  const showCollaboratorField = watchPaymentStatus === 'a_cobrar';

  const handleSubmit = (values: PaymentStatusFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Estado de Pago</DialogTitle>
          <DialogDescription>
            Selecciona el estado de pago para este transfer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de Pago</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cobrado">Cobrado</SelectItem>
                      <SelectItem value="a_cobrar">A Cobrar</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {showCollaboratorField && (
              <FormField
                control={form.control}
                name="paymentCollaborator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaborador que debe pagar</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el colaborador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {collaborators.map((collaborator) => (
                          <SelectItem key={collaborator.id} value={collaborator.name}>
                            {collaborator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
