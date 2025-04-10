
import { useState, useCallback } from 'react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useUserDialogs() {
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);

  const openEditDialog = useCallback((user: Profile) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  }, []);

  const openPasswordDialog = useCallback((user: Profile) => {
    setEditingUser(user);
    setIsPasswordDialogOpen(true);
  }, []);

  const confirmDeleteUser = useCallback((user: Profile) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  }, []);

  return {
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isPasswordDialogOpen,
    setIsPasswordDialogOpen,
    addUserDialogOpen,
    setAddUserDialogOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    userToDelete,
    openEditDialog,
    openPasswordDialog,
    confirmDeleteUser,
    setUserToDelete
  };
}
