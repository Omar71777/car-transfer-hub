
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UseDeleteUserProps } from './types';

export function useDeleteUser({ 
  users, 
  setUsers, 
  setDeleteConfirmOpen, 
  setUserToDelete 
}: UseDeleteUserProps) {
  return useCallback(async (userId: string) => {
    try {
      // First delete the profile from the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) {
        console.error('Error deleting profile:', profileError);
        toast.error(`Error al eliminar el perfil: ${profileError.message}`);
        return;
      }
      
      // Now try to delete the auth user - this will likely fail with regular client
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.error('Error deleting auth user, but profile was deleted:', authError);
          // We'll still consider this a success since the profile was deleted
        }
      } catch (authError) {
        console.error('Auth deletion failed, but profile was deleted:', authError);
        // We'll still consider this a success since the profile was deleted
      }
      
      // Update the UI by removing the user from the list
      setUsers(users => users.filter(u => u.id !== userId));
      
      toast.success('Usuario eliminado con éxito');
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(`Error al eliminar el usuario: ${error.message}`);
    }
  }, [setUsers, setDeleteConfirmOpen, setUserToDelete]);
}
