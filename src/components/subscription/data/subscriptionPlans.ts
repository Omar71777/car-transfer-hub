
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
