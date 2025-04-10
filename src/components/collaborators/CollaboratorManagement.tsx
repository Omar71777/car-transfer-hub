import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Collaborator, useCollaborators } from '@/hooks/useCollaborators';
import { CollaboratorTable } from './CollaboratorTable';
import { CollaboratorForm, CollaboratorFormValues } from './CollaboratorForm';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
export function CollaboratorManagement() {
  const {
    collaborators,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator
  } = useCollaborators();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCollaborator, setCurrentCollaborator] = useState<Collaborator | null>(null);
  const openAddDialog = () => {
    setCurrentCollaborator(null);
    setIsDialogOpen(true);
  };
  const openEditDialog = (collaborator: Collaborator) => {
    setCurrentCollaborator(collaborator);
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
        email: values.email
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
  return <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-left text-sm">Gestión de Colaboradores</CardTitle>
            <CardDescription className="text-xs text-left">
              Añade, edita o elimina colaboradores para asignar a transfers
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="shrink-0 text-xs mx-[8px] text-center py-0 px-[15px]">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Colaborador
          </Button>
        </CardHeader>
        <CardContent>
          <CollaboratorTable collaborators={collaborators} onEdit={openEditDialog} onDelete={openDeleteDialog} />
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
          <CollaboratorForm onSubmit={handleSubmit} initialValues={currentCollaborator} isEditing={!!currentCollaborator} />
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} collaborator={currentCollaborator} onConfirm={handleDelete} />
    </div>;
}