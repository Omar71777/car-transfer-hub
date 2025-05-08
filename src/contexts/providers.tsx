
import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { CapitalizeProvider } from './CapitalizeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { SubscriptionProvider } from './subscription';
import { DialogProvider } from '@/components/ui/dialog-service';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CapitalizeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <DialogProvider>
              {children}
              <Toaster closeButton position="top-right" />
            </DialogProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </CapitalizeProvider>
    </QueryClientProvider>
  );
}
