
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSubscription } from '@/contexts/subscription';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const SubscriptionPage = () => {
  const { subscription, checkSubscription, createCheckout, openCustomerPortal } = useSubscription();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const handleSelectPlan = async (plan: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [plan]: true }));
      const checkoutUrl = await createCheckout(plan);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Error al iniciar el proceso de suscripción');
    } finally {
      setIsLoading(prev => ({ ...prev, [plan]: false }));
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(prev => ({ ...prev, portal: true }));
      const portalUrl = await openCustomerPortal();
      if (portalUrl) {
        window.location.href = portalUrl;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Error al abrir el portal de suscripción');
    } finally {
      setIsLoading(prev => ({ ...prev, portal: false }));
    }
  };

  const handleRefreshStatus = async () => {
    try {
      setIsLoading(prev => ({ ...prev, refresh: true }));
      await checkSubscription();
      toast.success('Estado de suscripción actualizado');
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast.error('Error al verificar la suscripción');
    } finally {
      setIsLoading(prev => ({ ...prev, refresh: false }));
    }
  };

  const getFullTierName = (tier: string | null) => {
    switch (tier) {
      case 'basic': return 'Básico';
      case 'standard': return 'Estándar';
      case 'premium': return 'Premium';
      default: return 'No suscrito';
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestionar suscripción</h1>
          <p className="text-muted-foreground">
            Administra tu plan y suscripción
          </p>
        </div>

        {subscription.isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Current Subscription Status */}
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
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Próxima facturación</h3>
                      <p className="font-semibold">
                        {format(new Date(subscription.expiresAt), 'dd MMMM yyyy', { locale: es })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                {subscription.isSubscribed ? (
                  <Button 
                    onClick={handleManageSubscription} 
                    disabled={isLoading.portal}
                  >
                    {isLoading.portal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Administrar suscripción
                  </Button>
                ) : (
                  <Button onClick={() => navigate("#plans")}>Ver planes disponibles</Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleRefreshStatus}
                  disabled={isLoading.refresh}
                >
                  {isLoading.refresh && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Actualizar estado
                </Button>
              </CardFooter>
            </Card>

            {/* Subscription Plans */}
            <div id="plans">
              <h2 className="text-2xl font-bold mb-6">Planes disponibles</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Basic Plan */}
                <Card className={`border-2 ${subscription.tier === 'basic' ? 'border-primary' : 'border-muted'} relative`}>
                  {subscription.tier === 'basic' && (
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-xl pointer-events-none" />
                  )}
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold">Básico</h3>
                      <div className="mt-4 mb-4">
                        <span className="text-4xl font-bold">€19</span>
                        <span className="text-muted-foreground">/mes</span>
                      </div>
                      <p className="text-muted-foreground mb-6">Ideal para profesionales independientes</p>
                    </div>
                    <ul className="space-y-3">
                      <PlanFeature>Hasta 50 traslados al mes</PlanFeature>
                      <PlanFeature>Gestión de clientes</PlanFeature>
                      <PlanFeature>Facturación básica</PlanFeature>
                      <PlanFeature>Soporte por email</PlanFeature>
                    </ul>
                    {subscription.tier === 'basic' ? (
                      <div className="w-full mt-8 py-2 px-4 bg-primary/10 text-primary font-medium rounded-md text-center">
                        Plan actual
                      </div>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full mt-8" 
                        onClick={() => handleSelectPlan('basic')}
                        disabled={isLoading.basic}
                      >
                        {isLoading.basic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {subscription.isSubscribed ? 'Cambiar plan' : 'Seleccionar plan'}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Standard Plan */}
                <Card className={`border-2 ${subscription.tier === 'standard' ? 'border-primary' : 'border-muted'} relative`}>
                  {subscription.tier === 'standard' && (
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-xl pointer-events-none" />
                  )}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full font-medium text-sm">
                    Más popular
                  </div>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold">Estándar</h3>
                      <div className="mt-4 mb-4">
                        <span className="text-4xl font-bold">€39</span>
                        <span className="text-muted-foreground">/mes</span>
                      </div>
                      <p className="text-muted-foreground mb-6">Perfecto para empresas pequeñas</p>
                    </div>
                    <ul className="space-y-3">
                      <PlanFeature>Traslados ilimitados</PlanFeature>
                      <PlanFeature>Gestión avanzada de clientes</PlanFeature>
                      <PlanFeature>Facturación completa con PDF</PlanFeature>
                      <PlanFeature>Gestión de gastos</PlanFeature>
                      <PlanFeature>Soporte prioritario</PlanFeature>
                    </ul>
                    {subscription.tier === 'standard' ? (
                      <div className="w-full mt-8 py-2 px-4 bg-primary/10 text-primary font-medium rounded-md text-center">
                        Plan actual
                      </div>
                    ) : (
                      <Button 
                        className="w-full mt-8" 
                        onClick={() => handleSelectPlan('standard')}
                        disabled={isLoading.standard}
                      >
                        {isLoading.standard && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {subscription.isSubscribed ? 'Cambiar plan' : 'Seleccionar plan'}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className={`border-2 ${subscription.tier === 'premium' ? 'border-primary' : 'border-muted'} relative`}>
                  {subscription.tier === 'premium' && (
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-xl pointer-events-none" />
                  )}
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold">Premium</h3>
                      <div className="mt-4 mb-4">
                        <span className="text-4xl font-bold">€79</span>
                        <span className="text-muted-foreground">/mes</span>
                      </div>
                      <p className="text-muted-foreground mb-6">Para empresas con múltiples colaboradores</p>
                    </div>
                    <ul className="space-y-3">
                      <PlanFeature>Todo lo del plan Estándar</PlanFeature>
                      <PlanFeature>Gestión de colaboradores ilimitados</PlanFeature>
                      <PlanFeature>Análisis avanzado de rentabilidad</PlanFeature>
                      <PlanFeature>Acceso API</PlanFeature>
                      <PlanFeature>Soporte 24/7</PlanFeature>
                    </ul>
                    {subscription.tier === 'premium' ? (
                      <div className="w-full mt-8 py-2 px-4 bg-primary/10 text-primary font-medium rounded-md text-center">
                        Plan actual
                      </div>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full mt-8" 
                        onClick={() => handleSelectPlan('premium')}
                        disabled={isLoading.premium}
                      >
                        {isLoading.premium && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {subscription.isSubscribed ? 'Cambiar plan' : 'Seleccionar plan'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

const PlanFeature = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="flex items-center">
      <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
};

export default SubscriptionPage;
