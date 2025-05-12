
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, CreditCard, BarChart2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const QuickAccessCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Tarjeta de acceso rápido a Nuevos Transfers */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-purple-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 via-purple-100/20 to-purple-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-purple-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-purple-400/20 via-purple-400/60 to-purple-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Transfers */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-violet-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-100/0 via-violet-100/20 to-violet-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-violet-400/20 via-violet-400/60 to-violet-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Gastos */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-fuchsia-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-100/0 via-fuchsia-100/20 to-fuchsia-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-fuchsia-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-fuchsia-400/20 via-fuchsia-400/60 to-fuchsia-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Ganancias */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-pink-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/0 via-pink-100/20 to-pink-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-pink-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-pink-400/20 via-pink-400/60 to-pink-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
    </div>
  );
};
