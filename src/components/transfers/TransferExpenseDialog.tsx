
import React from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const expenseFormSchema = z.object({
  concept: z.string().min(2, { message: 'El concepto es obligatorio' }),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'El importe debe ser un número mayor que 0',
  }),
  date: z.date({
    required_error: 'La fecha es obligatoria',
  }),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface TransferExpenseContentProps {
  onSubmit: (values: ExpenseFormValues) => void;
  onClose: () => void;
  transferId: string | null;
}

// Component for the expense dialog content
export function TransferExpenseContent({
  onSubmit,
  onClose,
  transferId
}: TransferExpenseContentProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      concept: '',
      amount: '',
      date: new Date(),
    },
  });

  const handleSubmit = (values: ExpenseFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Añadir Gasto al Transfer</DialogTitle>
        <DialogDescription>
          Introduce los detalles del gasto asociado a este transfer.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="concept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concepto</FormLabel>
                <FormControl>
                  <Input placeholder="Peaje, combustible, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Importe (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "P", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Gasto</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

// Wrapper function to open the dialog using the dialog service
export function openTransferExpenseDialog(
  dialogService: ReturnType<typeof useDialog>,
  onSubmit: (values: ExpenseFormValues) => void,
  transferId: string | null
) {
  const { openDialog, closeDialog } = dialogService;
  
  openDialog(
    <TransferExpenseContent
      onSubmit={onSubmit}
      onClose={closeDialog}
      transferId={transferId}
    />,
    {
      width: 'md',
      preventOutsideClose: true,
      onClose: () => {
        console.log('Expense dialog closed');
      }
    }
  );
}

// Legacy interface for backward compatibility
interface TransferExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => void;
  transferId: string | null;
}

// Legacy component for backward compatibility
export function TransferExpenseDialog(props: TransferExpenseDialogProps) {
  const dialogService = useDialog();
  
  React.useEffect(() => {
    if (props.isOpen) {
      openTransferExpenseDialog(dialogService, props.onSubmit, props.transferId);
    }
  }, [props.isOpen]);
  
  return null;
}
