
import React from 'react';
import { CapitalizeProvider } from '@/contexts/CapitalizeContext';
import { AuthProvider } from '@/contexts/auth/AuthProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <CapitalizeProvider>
        {children}
      </CapitalizeProvider>
    </AuthProvider>
  );
}
