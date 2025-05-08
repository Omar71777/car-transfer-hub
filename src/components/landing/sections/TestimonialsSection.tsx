
import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { TestimonialCard } from '../TestimonialCard';

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30" id="testimonials">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Lo que dicen nuestros clientes"
          subtitle="Empresas que confían en CTHub para gestionar su negocio"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <TestimonialCard
            quote="Desde que uso esta plataforma, he reducido un 40% el tiempo que dedicaba a la gestión administrativa."
            author="María López"
            company="Madrid VIP Transfers"
            rating={5}
          />
          <TestimonialCard
            quote="La facturación automática y el seguimiento de pagos han cambiado completamente la forma en que gestiono mi negocio."
            author="Carlos Martínez"
            company="CM Transport"
            rating={5}
          />
          <TestimonialCard
            quote="El soporte al cliente es excepcional, siempre respondiendo rápidamente a cualquier consulta."
            author="Ana García"
            company="España Transfers"
            rating={4}
          />
        </div>
      </div>
    </section>
  );
};
