
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './types';
import { useAuthOperations } from './useAuthOperations';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
  } = useAuthOperations();
  
  // Track authentication state for better error recovery
  const [authInitialized, setAuthInitialized] = useState(false);
  const profileFetchAttempted = React.useRef(false);

  useEffect(() => {
    // First set up the auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Always update current session state
        setSession(session);
        setUser(session?.user ?? null);
        
        // When authentication status changes to signed in
        if (session?.user && event === 'SIGNED_IN') {
          // Use a small timeout to avoid blocking the auth state change
          setTimeout(() => {
            fetchUserProfile(session.user.id)
              .catch(error => {
                console.error('Error fetching user profile after auth state change:', error);
              });
          }, 0);
        }
        // When user signs out, clear all user data
        else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
          profileFetchAttempted.current = false;
        }
      }
    );

    // Then check the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch the user profile, but don't block initialization
        fetchUserProfile(session.user.id)
          .catch(error => {
            console.error('Error during initial profile fetch:', error);
          })
          .finally(() => {
            profileFetchAttempted.current = true;
            setIsLoading(false);
            setAuthInitialized(true);
          });
      } else {
        // No user, so we're done initializing
        setIsLoading(false);
        setAuthInitialized(true);
      }
    }).catch(error => {
      console.error('Error during initial auth check:', error);
      // Still mark initialization as complete to prevent hanging
      setIsLoading(false);
      setAuthInitialized(true);
    });

    return () => {
      // Clean up the subscription
      subscription.unsubscribe();
    };
  }, []);

  // Safety mechanism: if auth initialization takes too long, force completion
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!authInitialized) {
        console.warn('Auth initialization taking too long, forcing completion');
        setIsLoading(false);
        setAuthInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(safetyTimeout);
  }, [authInitialized]);

  const value: AuthContextType = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
