
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bill, TaxApplicationType } from '@/types/billing';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

const billEditSchema = z.object({
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  due_date: z.string().min(1, { message: 'La fecha de vencimiento es requerida' }),
  tax_rate: z.coerce.number().min(0, { message: 'El IVA debe ser un número positivo' }).default(10),
  tax_application: z.enum(['included', 'excluded'], {
    required_error: 'Debe seleccionar cómo aplicar el IVA',
  }).default('excluded'),
  notes: z.string().optional(),
});

type BillEditFormValues = z.infer<typeof billEditSchema>;

interface BillEditFormProps {
  bill: Bill;
  onSubmit: (values: Partial<Bill>) => Promise<void>;
}

export function BillEditForm({ bill, onSubmit }: BillEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BillEditFormValues>({
    resolver: zodResolver(billEditSchema),
    defaultValues: {
      date: bill.date,
      due_date: bill.due_date,
      tax_rate: bill.tax_rate,
      tax_application: bill.tax_application as TaxApplicationType,
      notes: bill.notes || '',
    },
  });

  const handleSubmit = async (values: BillEditFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de emisión</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de vencimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tax_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IVA (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_application"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Aplicación del IVA</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excluded" id="tax-excluded" />
                      <Label htmlFor="tax-excluded">Añadir IVA al precio (10€ + 10% = 11€)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="included" id="tax-included" />
                      <Label htmlFor="tax-included">IVA incluido en el precio (10€ incluye 10% IVA)</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Información adicional para la factura"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
