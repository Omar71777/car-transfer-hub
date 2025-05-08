
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const MobileNav = () => {
  return (
    <>
      {/* Mobile Nav Items */}
      <div className="md:hidden fixed top-6 right-6 z-40 flex flex-col gap-2">
        <Button size="sm" variant="outline" className="shadow-lg bg-background" asChild>
          <Link to="/auth">Iniciar Sesión</Link>
        </Button>
        <Button size="sm" className="shadow-lg" asChild>
          <Link to="/auth?tab=register">Registrarse</Link>
        </Button>
      </div>

      {/* Hero Navigation (mobile only) */}
      <div className="container mx-auto flex justify-center mt-6 mb-2 md:hidden">
        <div className="flex flex-wrap gap-2 justify-center">
          <a href="#features" className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Características</a>
          <a href="#pricing" className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Precios</a>
          <a href="#how-it-works" className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Cómo funciona</a>
        </div>
      </div>
    </>
  );
};
