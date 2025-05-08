
import React from 'react';
import { StatCard } from '../StatCard';

export const StatsSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard number="500+" label="Empresas" />
          <StatCard number="10k+" label="Traslados gestionados" />
          <StatCard number="98%" label="Satisfacción" />
          <StatCard number="40%" label="Ahorro de tiempo" />
        </div>
      </div>
    </section>
  );
};
