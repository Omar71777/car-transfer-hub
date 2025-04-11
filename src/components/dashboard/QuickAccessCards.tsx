
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, CreditCard, BarChart2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const QuickAccessCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Tarjeta de acceso rápido a Nuevos Transfers */}
      <Card className="relative overflow-hidden group border border-primary/10 bg-gradient-to-br from-electric/5 to-white">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-electric/0 via-electric/5 to-electric/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-electric" />
            <span>Nuevo Transfer</span>
          </CardTitle>
          <CardDescription>Registra un nuevo servicio</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full mt-2" variant="default">
            <Link to="/transfers/new">
              Crear Transfer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
        
        <div className="h-1 w-full bg-gradient-to-r from-electric/20 via-electric/60 to-electric/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Transfers */}
      <Card className="relative overflow-hidden group border border-primary/10 bg-gradient-to-br from-aqua/5 to-white">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-aqua/0 via-aqua/5 to-aqua/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-aqua-dark" />
            <span>Transfers</span>
          </CardTitle>
          <CardDescription>Gestiona tus servicios</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full mt-2" variant="outline">
            <Link to="/transfers">
              Ver Transfers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
        
        <div className="h-1 w-full bg-gradient-to-r from-aqua/20 via-aqua/60 to-aqua/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Gastos */}
      <Card className="relative overflow-hidden group border border-primary/10 bg-gradient-to-br from-pine/5 to-white">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pine/0 via-pine/5 to-pine/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-pine-dark" />
            <span>Gastos</span>
          </CardTitle>
          <CardDescription>Controla tus gastos</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full mt-2" variant="outline">
            <Link to="/expenses">
              Ver Gastos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
        
        <div className="h-1 w-full bg-gradient-to-r from-pine/20 via-pine/60 to-pine/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Ganancias */}
      <Card className="relative overflow-hidden group border border-primary/10 bg-gradient-to-br from-vibrant/5 to-white">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-vibrant/0 via-vibrant/5 to-vibrant/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-vibrant" />
            <span>Ganancias</span>
          </CardTitle>
          <CardDescription>Analiza tus resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full mt-2" variant="outline">
            <Link to="/profits">
              Ver Ganancias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
        
        <div className="h-1 w-full bg-gradient-to-r from-vibrant/20 via-vibrant/60 to-vibrant/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
    </div>
  );
};
