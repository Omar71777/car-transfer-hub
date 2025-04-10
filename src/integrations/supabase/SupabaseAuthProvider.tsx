
import React from 'react';
import { AuthProvider } from '@/contexts/auth';

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
