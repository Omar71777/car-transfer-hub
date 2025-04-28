
import React from 'react';
import { AppProviders } from '@/components/providers/AppProviders';
import { QueryProvider } from '@/components/providers/QueryProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AppProviders>
        {children}
      </AppProviders>
    </QueryProvider>
  );
}
