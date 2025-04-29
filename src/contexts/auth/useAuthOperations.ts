
import { useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export function useAuthOperations() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch user profile from Supabase
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      setProfile(data);
      setIsAdmin(data?.role === 'admin');
      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  }, []);
  
  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      return { success: false, error: error.message };
    }
  }, []);
  
  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      return { success: false, error: error.message };
    }
  }, []);
  
  // Sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      return { success: false, error: error.message };
    }
  }, []);
  
  // Update user profile
  const updateUserProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update profile state
      setProfile(prev => prev ? { ...prev, ...data } : data);
      
      // Update admin state if role changed
      if (profileData.role) {
        setIsAdmin(profileData.role === 'admin');
      }
      
      toast.success('Profile updated successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error(`Failed to update profile: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, [user]);
  
  // Delete account
  const deleteAccount = useCallback(async () => {
    try {
      const { error } = await supabase.functions.invoke('delete-account', {
        method: 'POST'
      });
      
      if (error) {
        throw error;
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.success('Account deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(`Failed to delete account: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, []);
  
  return {
    session,
    setSession,
    user,
    setUser,
    profile,
    setProfile,
    isAdmin,
    setIsAdmin,
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
