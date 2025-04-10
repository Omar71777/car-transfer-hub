
import { useFetchUsers } from './admin/useFetchUsers';
import { useUserDialogs } from './admin/useUserDialogs';
import { useUserOperations } from './admin/useUserOperations';

export function useAdminUsers() {
  const { 
    users, 
    setUsers, 
    loading, 
    fetchUsers 
  } = useFetchUsers();
  
  const {
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
  } = useUserDialogs();

  const {
    toggleUserRole,
    updateUser,
    resetPassword,
    createUser,
    deleteUser
  } = useUserOperations({
    users,
    setUsers,
    editingUser,
    setIsEditDialogOpen,
    setIsPasswordDialogOpen,
    setAddUserDialogOpen,
    setDeleteConfirmOpen,
    setUserToDelete,
    fetchUsers
  });

  return {
    // State
    users,
    loading,
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
    
    // Functions
    fetchUsers,
    toggleUserRole,
    updateUser,
    resetPassword,
    createUser,
    deleteUser,
    confirmDeleteUser,
    openEditDialog,
    openPasswordDialog,
  };
}
