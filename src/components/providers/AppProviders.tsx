
import React from 'react';
import { CapitalizeProvider } from '@/contexts/CapitalizeContext';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CapitalizeProvider>
          {children}
        </CapitalizeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
