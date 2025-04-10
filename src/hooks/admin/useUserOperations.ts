
import { useToggleUserRole } from './useToggleUserRole';
import { useUpdateUser } from './useUpdateUser';
import { useResetPassword } from './useResetPassword';
import { useCreateUser } from './useCreateUser';
import { useDeleteUser } from './useDeleteUser';
import { UseUserOperationsProps } from './types';

export function useUserOperations({
  users,
  setUsers,
  editingUser,
  setIsEditDialogOpen,
  setIsPasswordDialogOpen,
  setAddUserDialogOpen,
  setDeleteConfirmOpen,
  setUserToDelete,
  fetchUsers
}: UseUserOperationsProps) {
  
  const toggleUserRole = useToggleUserRole({ users, setUsers });
  
  const updateUser = useUpdateUser({ 
    users, 
    setUsers, 
    editingUser, 
    setIsEditDialogOpen 
  });
  
  const resetPassword = useResetPassword({ 
    editingUser, 
    setIsPasswordDialogOpen 
  });
  
  const createUser = useCreateUser({ 
    fetchUsers, 
    setAddUserDialogOpen 
  });
  
  const deleteUser = useDeleteUser({ 
    users, 
    setUsers, 
    setDeleteConfirmOpen, 
    setUserToDelete 
  });

  return {
    toggleUserRole,
    updateUser,
    resetPassword,
    createUser,
    deleteUser
  };
}
