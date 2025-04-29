
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
import {
  DialogFooter,
} from '@/components/ui/dialog';
import { Collaborator } from '@/hooks/useCollaborators';

export const collaboratorSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
});

export type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

interface CollaboratorFormProps {
  onSubmit: (values: CollaboratorFormValues) => void;
  initialValues?: Partial<Collaborator> | null;  // Make it Partial<Collaborator> to allow partial initialization
  isEditing: boolean;
}

export function CollaboratorForm({ onSubmit, initialValues, isEditing }: CollaboratorFormProps) {
  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: initialValues?.name || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="666 111 222" {...field} />
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
              <FormLabel>Email (opcional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ejemplo@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <Button type="submit">
            {isEditing ? 'Actualizar' : 'Añadir'} Colaborador
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
