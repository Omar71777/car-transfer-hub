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
import { Transfer } from '@/types';

const transferSchema = z.object({
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  time: z.string().optional(), // Changed from required to optional
  origin: z.string().min(1, { message: 'El origen es requerido' }),
  destination: z.string().min(1, { message: 'El destino es requerido' }),
  price: z.string().min(1, { message: 'El precio es requerido' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: 'El precio debe ser un número positivo' }
  ),
  collaborator: z.string().optional(), // Changed from required to optional
  commission: z.string().min(1, { message: 'La comisión es requerida' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0, 
    { message: 'La comisión debe ser un número positivo o cero' }
  ),
});

type TransferFormValues = z.infer<typeof transferSchema>;

interface TransferFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Transfer; // Add this prop to accept initial values
  isEditing?: boolean;
}

export function TransferForm({ onSubmit, initialValues, isEditing = false }: TransferFormProps) {
  // Convert numeric values to string for the form
  const getDefaultValues = () => {
    if (initialValues) {
      return {
        ...initialValues,
        price: initialValues.price.toString(),
        commission: initialValues.commission.toString(),
      };
    }
    
    return {
      date: new Date().toISOString().split('T')[0],
      time: '',
      origin: '',
      destination: '',
      price: '',
      collaborator: '',
      commission: '',
    };
  };

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: getDefaultValues(),
  });

  function handleSubmit(values: TransferFormValues) {
    // Convertir los valores string a número donde corresponda
    const processedValues = {
      ...values,
      price: Number(values.price),
      commission: Number(values.commission),
    };
    
    onSubmit(processedValues);
    if (!isEditing) {
      form.reset();
    }
    toast.success(isEditing ? 'Transfer actualizado con éxito' : 'Transfer creado con éxito');
  }

  return (
    <Card className="glass-card w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Transfer' : 'Nuevo Transfer'}</CardTitle>
        <CardDescription>
          Completa todos los campos para {isEditing ? 'actualizar el' : 'registrar un nuevo'} transfer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora (opcional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen</FormLabel>
                    <FormControl>
                      <Input placeholder="Aeropuerto de Ibiza" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino</FormLabel>
                    <FormControl>
                      <Input placeholder="Hotel Ushuaïa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="120.00" {...field} />
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
                    <FormLabel>Comisión (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" step="0.1" placeholder="10.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="collaborator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colaborador (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del colaborador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isEditing ? 'Actualizar Transfer' : 'Registrar Transfer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
