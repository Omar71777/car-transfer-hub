
import { useState, useCallback } from 'react';

export interface UseCollaboratorDialogProps {
  isCreatingCollaborator: boolean;
}

export type CollaboratorDialogStatus = 'creating' | 'idle';

export function useCollaboratorDialog(props: UseCollaboratorDialogProps) {
  const { isCreatingCollaborator } = props;
  const [isNewCollaboratorDialogOpen, setIsNewCollaboratorDialogOpen] = useState(false);
  
  // Calculate dialog status based on current state
  const dialogStatus: CollaboratorDialogStatus = isCreatingCollaborator ? 'creating' : 'idle';
  
  // Handle opening the new collaborator dialog
  const handleAddNewCollaborator = useCallback(() => {
    setIsNewCollaboratorDialogOpen(true);
  }, []);
  
  // Handle closing the dialog
  const closeDialog = useCallback(() => {
    if (!isCreatingCollaborator) {
      setIsNewCollaboratorDialogOpen(false);
    }
  }, [isCreatingCollaborator]);

  return {
    isNewCollaboratorDialogOpen,
    setIsNewCollaboratorDialogOpen,
    handleAddNewCollaborator,
    closeDialog,
    dialogStatus
  };
}
