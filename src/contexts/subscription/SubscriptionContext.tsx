
import React, { createContext, useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { SubscriptionContextType, SubscriptionState } from './types';

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const initialState: SubscriptionState = {
  isLoading: true,
  isSubscribed: false,
  tier: null,
  expiresAt: null,
  lastChecked: null,
  hasCheckedOnce: false,
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState>(initialState);
  
  const checkSubscription = useCallback(async () => {
    if (!session) {
      setSubscription({
        ...initialState,
        isLoading: false,
        hasCheckedOnce: true,
      });
      return;
    }
    
    try {
      setSubscription(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        throw error;
      }
      
      setSubscription({
        isLoading: false,
        isSubscribed: data.subscribed,
        tier: data.subscription_tier,
        expiresAt: data.subscription_end,
        lastChecked: new Date().toISOString(),
        hasCheckedOnce: true,
      });
      
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({ 
        ...prev,
        isLoading: false,
        hasCheckedOnce: true,
      }));
    }
  }, [session]);
  
  const createCheckout = useCallback(async (plan?: string): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Error al crear la sesión de pago');
      return null;
    }
  }, []);
  
  const openCustomerPortal = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      return data.url;
      
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Error al abrir el portal de cliente');
      return null;
    }
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session) {
      checkSubscription();
    } else {
      // Reset subscription state when logged out
      setSubscription({
        ...initialState,
        isLoading: false,
        hasCheckedOnce: true,
      });
    }
  }, [session, checkSubscription]);

  const value = {
    subscription,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
