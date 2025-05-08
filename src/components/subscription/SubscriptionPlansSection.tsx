
import React from 'react';
import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import { SubscriptionState } from '@/contexts/subscription/types';

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
  // Plan configuration data
  const plans = [
    {
      id: 'basic',
      title: 'Básico',
      price: '€19',
      description: 'Ideal para profesionales independientes',
      features: [
        'Hasta 50 traslados al mes',
        'Gestión de clientes',
        'Facturación básica',
        'Soporte por email'
      ],
      isPopular: false
    },
    {
      id: 'standard',
      title: 'Estándar',
      price: '€39',
      description: 'Perfecto para empresas pequeñas',
      features: [
        'Traslados ilimitados',
        'Gestión avanzada de clientes',
        'Facturación completa con PDF',
        'Gestión de gastos',
        'Soporte prioritario'
      ],
      isPopular: true
    },
    {
      id: 'premium',
      title: 'Premium',
      price: '€79',
      description: 'Para empresas con múltiples colaboradores',
      features: [
        'Todo lo del plan Estándar',
        'Gestión de colaboradores ilimitados',
        'Análisis avanzado de rentabilidad',
        'Acceso API',
        'Soporte 24/7'
      ],
      isPopular: false
    }
  ];

  return (
    <div id="plans">
      <h2 className="text-2xl font-bold mb-6">Planes disponibles</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            planId={plan.id as 'basic' | 'standard' | 'premium'}
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
