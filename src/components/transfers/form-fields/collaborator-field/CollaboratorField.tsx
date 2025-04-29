
import React from 'react';
import { Collaborator } from '@/hooks/useCollaborators';
import { useFormContext } from 'react-hook-form';
import { useCollaboratorCreation } from '@/hooks/collaborator/useCollaboratorCreation';
import { useTransferForm } from '../../context/TransferFormContext';
import { CollaboratorSelect } from './CollaboratorSelect';
import { CommissionSection } from './CommissionSection';
import { CollaboratorDialog } from './CollaboratorDialog';

export interface CollaboratorFieldProps {
  collaborators: Collaborator[];
  onCollaboratorCreated?: () => Promise<void>;
}

export function CollaboratorField({ collaborators, onCollaboratorCreated }: CollaboratorFieldProps) {
  const form = useFormContext();
  const { setIsServicioPropio } = useTransferForm();
  
  const creationHooks = useCollaboratorCreation({
    onSuccess: onCollaboratorCreated
  });
  
  const collaboratorValue = form.watch('collaborator');

  const handleCollaboratorChange = (value: string) => {
    if (value === 'servicio propio') {
      setIsServicioPropio(true);
    } else {
      setIsServicioPropio(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CollaboratorSelect 
          collaborators={collaborators} 
          onAddNew={creationHooks.handleAddNewCollaborator} 
          onChange={handleCollaboratorChange}
        />
      </div>

      {/* Commission Section - only display if a collaborator is selected and it's not "none" and not "servicio propio" */}
      {collaboratorValue && collaboratorValue !== 'none' && collaboratorValue !== 'servicio propio' && (
        <CommissionSection />
      )}

      <CollaboratorDialog
        isOpen={creationHooks.isNewCollaboratorDialogOpen}
        setIsOpen={creationHooks.setIsNewCollaboratorDialogOpen}
        onSubmit={creationHooks.handleNewCollaboratorSubmit}
        isCreating={creationHooks.isCreatingCollaborator}
        createError={creationHooks.createError}
        initialValues={{
          id: '',
          name: creationHooks.collaboratorName,
          phone: creationHooks.collaboratorPhone,
          email: creationHooks.collaboratorEmail
        }}
        dialogStatus={creationHooks.dialogStatus}
      />
    </>
  );
}
