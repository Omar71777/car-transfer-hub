import React, { useState } from 'react';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Phone, Mail } from 'lucide-react';
import { Collaborator, useCollaborators } from '@/hooks/useCollaborators';

const collaboratorSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
});

type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

export function CollaboratorManagement() {
  const { collaborators, addCollaborator, updateCollaborator, deleteCollaborator } = useCollaborators();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCollaborator, setCurrentCollaborator] = useState<Collaborator | null>(null);

  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
    },
  });

  const openAddDialog = () => {
    setCurrentCollaborator(null);
    form.reset({
      name: '',
      phone: '',
      email: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (collaborator: Collaborator) => {
    setCurrentCollaborator(collaborator);
    form.reset({
      name: collaborator.name,
      phone: collaborator.phone || '',
      email: collaborator.email || '',
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (collaborator: Collaborator) => {
    setCurrentCollaborator(collaborator);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (values: CollaboratorFormValues) => {
    if (currentCollaborator) {
      updateCollaborator(currentCollaborator.id, values);
    } else {
      const newCollaborator: Omit<Collaborator, 'id'> = {
        name: values.name,
        phone: values.phone,
        email: values.email,
      };
      addCollaborator(newCollaborator);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentCollaborator) {
      deleteCollaborator(currentCollaborator.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Gestión de Colaboradores</CardTitle>
            <CardDescription>
              Añade, edita o elimina colaboradores para asignar a transfers
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Colaborador
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collaborators.map((collaborator) => (
                <TableRow key={collaborator.id}>
                  <TableCell className="font-medium">{collaborator.name}</TableCell>
                  <TableCell>
                    {collaborator.phone && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {collaborator.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {collaborator.email && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {collaborator.email}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(collaborator)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => openDeleteDialog(collaborator)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {collaborators.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No hay colaboradores registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentCollaborator ? 'Editar Colaborador' : 'Nuevo Colaborador'}
            </DialogTitle>
            <DialogDescription>
              Completa el formulario con los datos del colaborador
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  {currentCollaborator ? 'Actualizar' : 'Añadir'} Colaborador
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al colaborador{' '}
              <span className="font-medium">{currentCollaborator?.name}</span>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
