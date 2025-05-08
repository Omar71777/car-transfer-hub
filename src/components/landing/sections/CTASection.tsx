
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="bg-primary text-primary-foreground py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-6">¿Listo para optimizar tu negocio de transfers?</h2>
        <p className="text-xl mb-8 opacity-90">
          Únete hoy mismo y disfruta de 14 días de prueba gratuita en cualquier plan
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth?tab=register">
              Comenzar prueba gratuita <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
            <a href="#pricing">Ver planes y precios</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
