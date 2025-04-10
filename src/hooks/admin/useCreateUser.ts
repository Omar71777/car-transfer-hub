
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
      
      // Step 1: Create auth user through signup
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
          }
        }
      });

      if (error) {
        if (error.message.includes("security purposes") || error.status === 429) {
          toast.error('Has intentado crear demasiados usuarios en poco tiempo. Por favor, espera unos minutos antes de intentarlo de nuevo.');
          return;
        }
        throw error;
      }
      
      // With RLS and the handle_new_user() trigger in place, the profile should be created automatically
      // We just need to wait a moment for the database trigger to execute
      
      toast.success('Usuario creado con éxito. El usuario necesitará confirmar su email antes de poder iniciar sesión.');
      setAddUserDialogOpen(false);
      
      // Wait a second before fetching users to give the trigger time to execute
      setTimeout(async () => {
        await fetchUsers();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(`Error al crear el usuario: ${error.message}`);
    }
  }, [fetchUsers, setAddUserDialogOpen]);
}
