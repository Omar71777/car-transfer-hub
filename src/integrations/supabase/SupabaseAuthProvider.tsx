
import React from 'react';
import { AuthProvider } from '@/contexts/auth/AuthProvider';

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
