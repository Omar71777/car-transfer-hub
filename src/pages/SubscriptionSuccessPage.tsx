
import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSubscription } from '@/contexts/subscription';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SubscriptionSuccessPage = () => {
  const { checkSubscription } = useSubscription();
  const location = useLocation();
  
  useEffect(() => {
    // Check subscription status after successful payment
    checkSubscription();
  }, [checkSubscription]);

  return (
    <MainLayout>
      <div className="container max-w-lg py-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">¡Suscripción exitosa!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Gracias por suscribirte a Ibiza Transfer Hub. Tu cuenta ha sido actualizada y ahora tienes acceso a todas las funciones de tu plan.
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild size="lg">
            <Link to="/">
              Ir al Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/subscription">
              Ver detalles de mi suscripción
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubscriptionSuccessPage;
