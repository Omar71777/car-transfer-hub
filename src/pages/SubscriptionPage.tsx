
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSubscription } from '@/contexts/subscription';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  SubscriptionStatusCard,
  SubscriptionPlansSection
} from '@/components/subscription';

const SubscriptionPage = () => {
  const { subscription, checkSubscription, createCheckout, openCustomerPortal } = useSubscription();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const handleSelectPlan = async (plan: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [plan]: true }));
      
      const response = await createCheckout(plan);
      
      if (!response) {
        toast.error('Error al iniciar el proceso de suscripción');
        return;
      }
      
      if (response.directUpdate) {
        // For free plan, just refresh the subscription status
        await checkSubscription();
        if (response.url) {
          window.location.href = response.url;
        }
      } else if (response.url) {
        window.location.href = response.url;
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

  const handleViewPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
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
            <SubscriptionStatusCard 
              subscription={subscription}
              onManageSubscription={handleManageSubscription}
              onRefreshStatus={handleRefreshStatus}
              onViewPlans={handleViewPlans}
              isLoading={isLoading}
            />

            {/* Subscription Plans */}
            <SubscriptionPlansSection 
              subscription={subscription}
              onSelectPlan={handleSelectPlan}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default SubscriptionPage;
