
import { useState, useCallback } from 'react';

interface UseCollaboratorDialogProps {
  isCreatingCollaborator: boolean;
}

export function useCollaboratorDialog({
  isCreatingCollaborator
}: UseCollaboratorDialogProps) {
  const [isNewCollaboratorDialogOpen, setIsNewCollaboratorDialogOpen] = useState(false);
  
  // Calculate dialog status based on current state
  const dialogStatus = isCreatingCollaborator ? 'creating' as const : 'idle' as const;
  
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
