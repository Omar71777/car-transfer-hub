
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserFormValues, UseUpdateUserProps } from './types';

export function useUpdateUser({ 
  users, 
  setUsers, 
  editingUser, 
  setIsEditDialogOpen 
}: UseUpdateUserProps) {
  return useCallback(async (values: UserFormValues) => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name || null,
          last_name: values.last_name || null,
          email: values.email || null,
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      setUsers(users => users.map(u => 
        u.id === editingUser.id ? { ...u, ...values } : u
      ));
      
      toast.success('Usuario actualizado con éxito');
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario');
    }
  }, [editingUser, setUsers, setIsEditDialogOpen]);
}
