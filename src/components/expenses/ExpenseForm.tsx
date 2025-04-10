
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const expenseSchema = z.object({
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  concept: z.string().min(1, { message: 'El concepto es requerido' }),
  amount: z.string().min(1, { message: 'El monto es requerido' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: 'El monto debe ser un número positivo' }
  ),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSubmit: (values: any) => void;
  transferId?: string;
  defaultValues?: Partial<ExpenseFormValues>;
  isEditing?: boolean;
}

export function ExpenseForm({ onSubmit, transferId, defaultValues, isEditing = false }: ExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultValues || {
      date: new Date().toISOString().split('T')[0],
      concept: '',
      amount: '',
    },
  });

  function handleSubmit(values: ExpenseFormValues) {
    // Convertir los valores string a número donde corresponda
    const processedValues = {
      ...values,
      amount: Number(values.amount),
      transferId,
    };
    
    onSubmit(processedValues);
    if (!isEditing) {
      form.reset();
    }
    toast.success(isEditing ? 'Gasto actualizado con éxito' : 'Gasto registrado con éxito');
  }

  return (
    <Card className="glass-card w-full max-w-lg mx-auto border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="concept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concepto</FormLabel>
                  <FormControl>
                    <Input placeholder="Combustible, peaje, etc." className="w-full" {...field} />
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
                  <FormLabel>Monto (€)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="25.50" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isEditing ? 'Actualizar Gasto' : 'Registrar Gasto'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
