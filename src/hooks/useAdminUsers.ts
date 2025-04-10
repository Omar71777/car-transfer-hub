import { useState, useCallback } from 'react';
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

export function useAdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);
  
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
  }, []);

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
  }, [editingUser]);

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
  }, [editingUser]);

  const createUser = useCallback(async (values: UserFormValues & PasswordFormValues) => {
    try {
      if (!values.email || !values.password || !values.first_name || !values.last_name) {
        toast.error('Todos los campos son requeridos');
        return;
      }

      const cleanEmail = values.email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          first_name: values.first_name,
          last_name: values.last_name,
        }
      });

      if (error) throw error;
      
      if (data.user) {
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
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(`Error al crear el usuario: ${error.message}`);
    }
  }, [fetchUsers]);

  const openEditDialog = useCallback((user: Profile) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  }, []);

  const openPasswordDialog = useCallback((user: Profile) => {
    setEditingUser(user);
    setIsPasswordDialogOpen(true);
  }, []);

  return {
    users,
    loading,
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isPasswordDialogOpen,
    setIsPasswordDialogOpen,
    addUserDialogOpen,
    setAddUserDialogOpen,
    fetchUsers,
    toggleUserRole,
    updateUser,
    resetPassword,
    createUser,
    openEditDialog,
    openPasswordDialog,
  };
}
