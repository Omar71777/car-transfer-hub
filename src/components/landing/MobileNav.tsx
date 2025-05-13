
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed top-6 right-6 z-40">
        <Button 
          size="sm" 
          variant="outline" 
          className="shadow-lg bg-background" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 right-4 z-40 bg-white/95 backdrop-blur-md shadow-lg rounded-xl border border-border/30 p-4 w-48 animate-fade-in">
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" className="justify-start" asChild>
              <Link to="/auth" onClick={toggleMenu}>Iniciar Sesión</Link>
            </Button>
            <Button size="sm" className="justify-start" asChild>
              <Link to="/auth?tab=register" onClick={toggleMenu}>Registrarse</Link>
            </Button>
            <div className="h-px bg-border/50 my-2"></div>
            <a href="#features" className="px-3 py-2 text-sm hover:bg-primary/10 rounded-md" onClick={toggleMenu}>Características</a>
            <a href="#pricing" className="px-3 py-2 text-sm hover:bg-primary/10 rounded-md" onClick={toggleMenu}>Precios</a>
            <a href="#how-it-works" className="px-3 py-2 text-sm hover:bg-primary/10 rounded-md" onClick={toggleMenu}>Cómo funciona</a>
          </div>
        </div>
      )}

      {/* Remove the separate hero navigation pills as they're now in the dropdown menu */}
    </>
  );
};
