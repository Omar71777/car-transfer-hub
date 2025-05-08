
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { subscriptionPlans, SubscriptionPlan } from '@/components/subscription';

export const PricingSection = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  const yearlyPrice = (price: string): string => {
    // If price is €0, yearly price is also €0
    if (price === '€0') return '€0';
    
    const numericPrice = parseFloat(price.replace('€', ''));
    const yearlyPrice = Math.round(numericPrice * 10);
    return `€${yearlyPrice}`;
  };

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Planes que se adaptan a tu negocio"
          subtitle="Elige el plan que mejor se adapte a las necesidades de tu negocio"
        />
        
        <div className="flex justify-center mt-8 mb-12">
          <Tabs 
            defaultValue="monthly" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'monthly' | 'yearly')}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="yearly">
                Anual <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Ahorra 20%</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan: SubscriptionPlan) => (
            <Card key={plan.id} className={`border-2 ${plan.isPopular ? 'border-primary' : 'border-muted'} relative`}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full font-medium text-sm">
                  Más popular
                </div>
              )}
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold">{plan.title}</h3>
                  <div className="mt-4 mb-4">
                    <span className="text-4xl font-bold">{activeTab === 'monthly' ? plan.price : yearlyPrice(plan.price)}</span>
                    <span className="text-muted-foreground">/{activeTab === 'monthly' ? 'mes' : 'año'}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.isPopular ? "default" : "outline"} 
                  className="w-full mt-8" 
                  asChild
                >
                  <Link to={`/auth?tab=register&plan=${plan.id}`}>
                    {plan.price === '€0' ? 'Registrarse gratis' : 'Seleccionar plan'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
