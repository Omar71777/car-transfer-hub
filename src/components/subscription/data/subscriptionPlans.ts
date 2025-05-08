
import { SubscriptionTier } from '@/contexts/subscription/types';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    title: 'Básico',
    price: '€0',
    description: 'Ideal para profesionales independientes',
    features: [
      'Hasta 50 traslados al mes',
      'Gestión de clientes',
      'Soporte por email'
    ],
    isPopular: false
  },
  {
    id: 'standard',
    title: 'Estándar',
    price: '€15',
    description: 'Perfecto para empresas pequeñas',
    features: [
      'Traslados ilimitados',
      'Gestión avanzada de clientes',
      'Facturación completa con PDF',
      'Gestión de gastos',
      'Soporte prioritario'
    ],
    isPopular: true
  }
];
