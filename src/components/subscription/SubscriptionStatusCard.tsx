
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionState } from '@/contexts/subscription/types';

interface SubscriptionStatusCardProps {
  subscription: SubscriptionState;
  onManageSubscription: () => void;
  onRefreshStatus: () => void;
  onViewPlans: () => void;
  isLoading: { [key: string]: boolean };
}

export const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  subscription,
  onManageSubscription,
  onRefreshStatus,
  onViewPlans,
  isLoading
}) => {
  const getFullTierName = (tier: string | null) => {
    switch (tier) {
      case 'basic': return 'Básico';
      case 'standard': return 'Estándar';
      case 'premium': return 'Premium';
      default: return 'No suscrito';
    }
  };

  const isFreeTier = subscription.tier === 'basic';

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Estado actual</CardTitle>
        <CardDescription>Tu suscripción actual y detalles de facturación</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Plan</h3>
            <p className="font-semibold">{getFullTierName(subscription.tier)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Estado</h3>
            <p className="font-semibold">
              {subscription.isSubscribed ? (
                <span className="text-green-600">Activa</span>
              ) : (
                <span className="text-amber-600">No suscrito</span>
              )}
            </p>
          </div>
          {subscription.expiresAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {isFreeTier ? 'Válido hasta' : 'Próxima facturación'}
              </h3>
              <p className="font-semibold">
                {format(new Date(subscription.expiresAt), 'dd MMMM yyyy', { locale: es })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        {subscription.isSubscribed ? (
          isFreeTier ? (
            <Button onClick={onViewPlans}>Ver planes premium</Button>
          ) : (
            <Button 
              onClick={onManageSubscription} 
              disabled={isLoading.portal}
            >
              {isLoading.portal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Administrar suscripción
            </Button>
          )
        ) : (
          <Button onClick={onViewPlans}>Ver planes disponibles</Button>
        )}
        <Button 
          variant="outline" 
          onClick={onRefreshStatus}
          disabled={isLoading.refresh}
        >
          {isLoading.refresh && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Actualizar estado
        </Button>
      </CardFooter>
    </Card>
  );
};
