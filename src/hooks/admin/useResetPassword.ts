
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UseResetPasswordProps } from './types';

export function useResetPassword({ 
  editingUser, 
  setIsPasswordDialogOpen 
}: UseResetPasswordProps) {
  return useCallback(async () => {
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
}
