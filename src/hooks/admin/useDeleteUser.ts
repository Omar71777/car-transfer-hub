
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
      // For user deletion, we can only delete the profile from our public table
      // We can't delete the actual auth user from client-side code due to permissions
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) {
        console.error('Error deleting profile:', profileError);
        toast.error(`Error al eliminar el perfil: ${profileError.message}`);
        return;
      }
      
      // We'll just inform the user that while the profile was deleted
      // the auth record would need admin action to be fully removed
      
      // Update the UI by removing the user from the list
      setUsers(users => users.filter(u => u.id !== userId));
      
      toast.success('Perfil de usuario eliminado con éxito');
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(`Error al eliminar el usuario: ${error.message}`);
    }
  }, [setUsers, setDeleteConfirmOpen, setUserToDelete]);
}
