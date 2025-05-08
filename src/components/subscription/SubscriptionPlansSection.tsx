
import React from 'react';
import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import { SubscriptionState } from '@/contexts/subscription/types';
import { subscriptionPlans } from './data/subscriptionPlans';

interface SubscriptionPlansSectionProps {
  subscription: SubscriptionState;
  onSelectPlan: (plan: string) => void;
  isLoading: { [key: string]: boolean };
}

export const SubscriptionPlansSection: React.FC<SubscriptionPlansSectionProps> = ({
  subscription,
  onSelectPlan,
  isLoading
}) => {
  return (
    <div id="plans">
      <h2 className="text-2xl font-bold mb-6">Planes disponibles</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            planId={plan.id}
            currentTier={subscription.tier}
            isPopular={plan.isPopular}
            isSubscribed={subscription.isSubscribed}
            onSelectPlan={onSelectPlan}
            isLoading={isLoading[plan.id]}
          />
        ))}
      </div>
    </div>
  );
};
