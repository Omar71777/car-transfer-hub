
import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { FeatureCard } from '../FeatureCard';
import { 
  PanelTop, Globe, CreditCard, 
  CalendarIcon, TrendingUp, Users 
} from 'lucide-react';

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-4" id="features">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Todo lo que necesitas para gestionar tu negocio"
          subtitle="Herramientas diseñadas para los profesionales del transporte en España"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<PanelTop className="h-10 w-10 text-primary" />}
            title="Panel intuitivo"
            description="Visualiza todos tus servicios y ganancias en un panel de control sencillo e intuitivo."
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10 text-primary" />}
            title="Gestión de traslados"
            description="Registra orígenes, destinos y detalles de cada servicio fácilmente."
            highlighted={true}
          />
          <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-primary" />}
            title="Facturación integrada"
            description="Genera facturas profesionales con un solo clic y envíalas directamente a tus clientes."
          />
          <FeatureCard
            icon={<CalendarIcon className="h-10 w-10 text-primary" />}
            title="Programación de servicios"
            description="Organiza tus traslados por fecha y hora con recordatorios automáticos."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-primary" />}
            title="Análisis de rendimiento"
            description="Monitorea tus ingresos, gastos y rentabilidad con informes detallados."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Gestión de colaboradores"
            description="Administra fácilmente a los conductores y colaboradores de tu empresa."
            highlighted={true}
          />
        </div>
      </div>
    </section>
  );
};
