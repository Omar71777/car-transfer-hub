
export type SubscriptionTier = 'basic' | 'standard' | 'premium' | null;

export interface SubscriptionState {
  isLoading: boolean;
  isSubscribed: boolean;
  tier: SubscriptionTier;
  expiresAt: string | null;
  lastChecked: string | null;
  hasCheckedOnce: boolean;
}

export interface SubscriptionContextType {
  subscription: SubscriptionState;
  checkSubscription: () => Promise<void>;
  createCheckout: (plan?: string) => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
}
