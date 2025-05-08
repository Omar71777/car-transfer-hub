
export type SubscriptionTier = 'basic' | 'standard' | null;

export interface SubscriptionState {
  isLoading: boolean;
  isSubscribed: boolean;
  tier: SubscriptionTier;
  expiresAt: string | null;
  lastChecked: string | null;
  hasCheckedOnce: boolean;
}

export interface CheckoutResponse {
  url?: string;
  directUpdate?: boolean;
}

export interface SubscriptionContextType {
  subscription: SubscriptionState;
  checkSubscription: () => Promise<void>;
  createCheckout: (plan?: string) => Promise<CheckoutResponse | null>;
  openCustomerPortal: () => Promise<string | null>;
}
