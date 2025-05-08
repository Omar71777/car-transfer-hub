
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Package, TrendingUp } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { StepCard } from '../StepCard';

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30" id="how-it-works">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Cómo funciona"
          subtitle="Comienza a utilizar CTHub en tres sencillos pasos"
        />
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <StepCard
            number={1}
            title="Regístrate y configura"
            description="Crea tu cuenta, configura tu perfil y personaliza las preferencias de tu empresa."
            icon={<Rocket className="h-8 w-8 text-primary" />}
          />
          <StepCard
            number={2}
            title="Añade tus servicios"
            description="Comienza a registrar tus traslados, disposiciones y otros servicios en la plataforma."
            icon={<Package className="h-8 w-8 text-primary" />}
          />
          <StepCard
            number={3}
            title="Gestiona y factura"
            description="Genera facturas, controla pagos y visualiza informes de rendimiento fácilmente."
            icon={<TrendingUp className="h-8 w-8 text-primary" />}
          />
        </div>
        
        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link to="/auth?tab=register">
              Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
