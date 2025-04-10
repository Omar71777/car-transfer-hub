
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
      console.log('Attempting to delete user with ID:', userId);
      
      // First, try to delete the user using the serverless function
      const { data: functionData, error: functionError } = await supabase.functions.invoke('delete-account', {
        body: { userId: userId },
      });
      
      if (functionError) {
        console.error('Error calling delete-account function:', functionError);
        
        // Fallback to just deleting the profile if the function fails
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (profileError) {
          console.error('Error deleting profile:', profileError);
          toast.error(`Error al eliminar el perfil: ${profileError.message}`);
          return;
        }
      } else {
        console.log('Function response:', functionData);
      }
      
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
