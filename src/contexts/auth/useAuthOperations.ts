
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './types';

export function useAuthOperations() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setProfile(data as UserProfile);
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Inicio de sesión exitoso');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Registro exitoso. Por favor verifica tu email.');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Sesión cerrada con éxito');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast.success('Perfil actualizado con éxito');
    } catch (error: any) {
      toast.error(`Error al actualizar el perfil: ${error.message}`);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user || !session) return false;
    
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;
      
      await supabase.auth.signOut();
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.success('Cuenta eliminada con éxito');
      return true;
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(`Error al eliminar la cuenta: ${error.message}`);
      return false;
    }
  };

  return {
    session,
    setSession,
    user,
    setUser,
    profile,
    isAdmin,
    isLoading,
    setIsLoading,
    fetchUserProfile,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    deleteAccount,
  };
}
