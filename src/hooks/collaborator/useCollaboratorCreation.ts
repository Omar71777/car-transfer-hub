
import { useState, useCallback } from 'react';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useCollaboratorDialog, CollaboratorDialogStatus } from './useCollaboratorDialog';
import { toast } from 'sonner';
import { CollaboratorFormValues } from '@/components/collaborators/CollaboratorForm';

export function useCollaboratorCreation({ 
  onSuccess 
}: { 
  onSuccess?: () => Promise<void> 
}) {
  const [collaboratorName, setCollaboratorName] = useState('');
  const [collaboratorPhone, setCollaboratorPhone] = useState('');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreatingCollaborator, setIsCreatingCollaborator] = useState(false);

  const { addCollaborator } = useCollaborators();

  const dialogHooks = useCollaboratorDialog({ isCreatingCollaborator });

  const handleNewCollaboratorSubmit = useCallback(async (values: CollaboratorFormValues) => {
    try {
      setIsCreatingCollaborator(true);
      setCreateError(null);
      
      const { name, phone, email } = values;
      
      if (!name || name.trim() === '') {
        setCreateError('El nombre es obligatorio');
        setIsCreatingCollaborator(false);
        return;
      }
      
      console.log('Submitting new collaborator:', name, phone, email);
      const success = await addCollaborator({ name, phone, email });

      if (success) {
        toast.success('Colaborador creado exitosamente');
        
        // Reset form fields
        setCollaboratorName('');
        setCollaboratorPhone('');
        setCollaboratorEmail('');
        
        // Close dialog using the property from dialogHooks
        dialogHooks.closeDialog();

        // Call onSuccess if provided
        if (onSuccess) {
          await onSuccess();
        }
      } else {
        setCreateError('Error al crear el colaborador');
      }
    } catch (error: any) {
      console.error('Error creating collaborator:', error);
      setCreateError(error.message || 'Error desconocido');
    } finally {
      setIsCreatingCollaborator(false);
    }
  }, [addCollaborator, dialogHooks, onSuccess]);

  return {
    // Dialog state hooks
    ...dialogHooks,
    
    // Form values
    collaboratorName,
    setCollaboratorName,
    collaboratorPhone,
    setCollaboratorPhone,
    collaboratorEmail,
    setCollaboratorEmail,
    
    // Status
    isCreatingCollaborator,
    createError,
    
    // Action handlers
    handleNewCollaboratorSubmit
  };
}
