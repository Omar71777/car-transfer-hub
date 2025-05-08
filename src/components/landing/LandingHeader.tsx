
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

export const LandingHeader = () => {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CTHub</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Características</a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Precios</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">Cómo funciona</a>
          <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Testimonios</a>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">
            Iniciar Sesión
          </Link>
          <Button asChild>
            <Link to="/auth?tab=register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
