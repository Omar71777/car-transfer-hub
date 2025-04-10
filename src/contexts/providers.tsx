
import React from 'react';
import { AppProviders } from '@/components/providers/AppProviders';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}
