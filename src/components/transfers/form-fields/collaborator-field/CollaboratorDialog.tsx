
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CollaboratorForm, CollaboratorFormValues } from '@/components/collaborators/CollaboratorForm';
import { CollaboratorDialogStatus } from '@/hooks/collaborator/useCollaboratorDialog';
import { Collaborator } from '@/hooks/useCollaborators';

interface CollaboratorDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: CollaboratorFormValues) => Promise<void>;
  isCreating: boolean;
  createError: string | null;
  initialValues: Partial<Collaborator>;
  dialogStatus: CollaboratorDialogStatus;
}

export function CollaboratorDialog({
  isOpen,
  setIsOpen,
  onSubmit,
  isCreating,
  createError,
  initialValues,
  dialogStatus
}: CollaboratorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Colaborador</DialogTitle>
        </DialogHeader>
        {dialogStatus === 'idle' ? (
          <CollaboratorForm 
            onSubmit={onSubmit}
            initialValues={initialValues}
            isEditing={false} 
          />
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Creando colaborador...</span>
          </div>
        )}
        {createError && (
          <div className="text-destructive text-sm mt-2">{createError}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
