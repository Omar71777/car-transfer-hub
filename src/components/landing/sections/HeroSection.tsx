
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-24 px-4 mt-10 md:mt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-blue-50 -z-10"></div>
      <div className="absolute inset-0 opacity-10 -z-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
              Gestión de traslados simplificada
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              La plataforma completa para tu <span className="text-primary">negocio de traslados</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Optimiza tus servicios de transporte en España con nuestra solución todo en uno: gestión de traslados, facturación, cobros y mucho más.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/auth?tab=register">
                  Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">Ver cómo funciona</a>
              </Button>
            </div>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-2">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>14 días de prueba gratuita</span>
              </div>
              <span className="hidden sm:inline mx-2">•</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Sin tarjeta de crédito</span>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-xl animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-primary/10 opacity-80"></div>
            <div className="relative p-2">
              <img 
                src="/placeholder.svg" 
                alt="CTHub Dashboard" 
                className="rounded-xl shadow-lg border border-primary/10"
              />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
