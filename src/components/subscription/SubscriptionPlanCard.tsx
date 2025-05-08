
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PlanFeature } from './PlanFeature';
import { SubscriptionTier } from '@/contexts/subscription/types';

interface SubscriptionPlanCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  planId: SubscriptionTier;
  currentTier: SubscriptionTier;
  isPopular?: boolean;
  isSubscribed: boolean;
  onSelectPlan: (plan: string) => void;
  isLoading: boolean;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  title,
  price,
  description,
  features,
  planId,
  currentTier,
  isPopular = false,
  isSubscribed,
  onSelectPlan,
  isLoading
}) => {
  const isCurrentPlan = currentTier === planId;

  return (
    <Card className={`border-2 ${isCurrentPlan ? 'border-primary' : 'border-muted'} relative`}>
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-xl pointer-events-none" />
      )}
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full font-medium text-sm">
          Más popular
        </div>
      )}
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="mt-4 mb-4">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground">/mes</span>
          </div>
          <p className="text-muted-foreground mb-6">{description}</p>
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <PlanFeature key={index}>{feature}</PlanFeature>
          ))}
        </ul>
        {isCurrentPlan ? (
          <div className="w-full mt-8 py-2 px-4 bg-primary/10 text-primary font-medium rounded-md text-center">
            Plan actual
          </div>
        ) : (
          <Button 
            variant="default" 
            className="w-full mt-8" 
            onClick={() => onSelectPlan(planId || '')}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubscribed ? 'Cambiar plan' : 'Seleccionar plan'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
