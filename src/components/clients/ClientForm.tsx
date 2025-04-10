
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
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
import { CreateClientDto } from '@/types/client';

const clientSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Email inválido' }).min(1, { message: 'El email es requerido' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional(),
});

interface ClientFormProps {
  initialValues?: Partial<CreateClientDto>;
  onSubmit: (values: CreateClientDto) => void;
  isEditing?: boolean;
}

export function ClientForm({ initialValues, onSubmit, isEditing = false }: ClientFormProps) {
  const form = useForm<CreateClientDto>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      address: initialValues?.address || '',
      tax_id: initialValues?.tax_id || '',
      notes: initialValues?.notes || '',
    },
  });

  function handleSubmit(values: CreateClientDto) {
    onSubmit(values);
  }

  return (
    <Card className="glass-card w-full max-w-2xl mx-auto">
      <CardContent className="pt-4 px-3 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del cliente" {...field} className="mobile-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="cliente@ejemplo.com"
                        {...field}
                        className="mobile-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+34 123 456 789" {...field} className="mobile-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF/CIF (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="B12345678" {...field} className="mobile-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Calle, ciudad, código postal"
                      {...field}
                      className="mobile-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre el cliente"
                      {...field}
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mobile-btn">
              {isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
