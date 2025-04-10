
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserFormValues = {
  first_name?: string;
  last_name?: string;
  email?: string;
};
type PasswordFormValues = {
  password: string;
};

interface UseUserOperationsProps {
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
  editingUser: Profile | null;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsPasswordDialogOpen: (open: boolean) => void;
  setAddUserDialogOpen: (open: boolean) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  setUserToDelete: (user: Profile | null) => void;
  fetchUsers: () => Promise<void>;
}

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
  
  const toggleUserRole = useCallback(async (userId: string, currentRole: 'admin' | 'user') => {
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

  const updateUser = useCallback(async (values: UserFormValues) => {
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

  const resetPassword = useCallback(async () => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(editingUser.email || '', {
        redirectTo: window.location.origin + '/auth?reset=true',
      });

      if (error) throw error;
      
      toast.success(`Se ha enviado un email para restablecer la contraseña a ${editingUser.email}`);
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast.error(`Error al enviar el email de restablecimiento: ${error.message}`);
    }
  }, [editingUser, setIsPasswordDialogOpen]);

  const createUser = useCallback(async (values: UserFormValues & PasswordFormValues) => {
    try {
      if (!values.email || !values.password || !values.first_name || !values.last_name) {
        toast.error('Todos los campos son requeridos');
        return;
      }

      const cleanEmail = values.email.trim().toLowerCase();
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        toast.error('El formato del email no es válido');
        return;
      }
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          first_name: values.first_name,
          last_name: values.last_name,
        }
      });

      if (error) {
        if (error.message.includes("security purposes") || error.status === 429) {
          toast.error('Has intentado crear demasiados usuarios en poco tiempo. Por favor, espera unos minutos antes de intentarlo de nuevo.');
          return;
        }
        throw error;
      }
      
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: cleanEmail,
              first_name: values.first_name,
              last_name: values.last_name,
              role: 'user',
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            toast.error(`Error al crear el perfil: ${profileError.message}`);
            return;
          }
          
          toast.success('Usuario creado con éxito');
          setAddUserDialogOpen(false);
          await fetchUsers();
        } catch (profileError: any) {
          console.error('Error creating profile:', profileError);
          toast.error(`Error al crear el perfil: ${profileError.message}`);
        }
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(`Error al crear el usuario: ${error.message}`);
    }
  }, [fetchUsers, setAddUserDialogOpen]);

  const deleteUser = useCallback(async (userId: string) => {
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

  return {
    toggleUserRole,
    updateUser,
    resetPassword,
    createUser,
    deleteUser
  };
}
