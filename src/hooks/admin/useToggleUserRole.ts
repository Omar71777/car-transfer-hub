
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UseToggleUserRoleProps } from './types';

export function useToggleUserRole({ users, setUsers }: UseToggleUserRoleProps) {
  return useCallback(async (userId: string, currentRole: 'admin' | 'user') => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users => users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success(`Usuario actualizado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`);
    } catch (error: any) {
      console.error('Error toggling user role:', error);
      toast.error('Error al actualizar el rol del usuario');
    }
  }, [users, setUsers]);
}
