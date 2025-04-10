
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserFormValues, PasswordFormValues, UseCreateUserProps } from './types';

export function useCreateUser({ 
  fetchUsers, 
  setAddUserDialogOpen 
}: UseCreateUserProps) {
  return useCallback(async (values: UserFormValues & PasswordFormValues) => {
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
}
