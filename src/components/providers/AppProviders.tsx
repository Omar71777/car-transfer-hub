
import React from 'react';
import { CapitalizeProvider } from '@/contexts/CapitalizeContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <CapitalizeProvider>
      {children}
    </CapitalizeProvider>
  );
}
