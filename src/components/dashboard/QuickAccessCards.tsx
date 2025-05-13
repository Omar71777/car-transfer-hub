
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, CreditCard, BarChart2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const QuickAccessCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Tarjeta de acceso rápido a Nuevos Transfers */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-blue-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/20 to-blue-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-blue-400/20 via-blue-400/60 to-blue-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Transfers */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-sky-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100/0 via-sky-100/20 to-sky-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-sky-400/20 via-sky-400/60 to-sky-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Gastos */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-cyan-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/0 via-cyan-100/20 to-cyan-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-cyan-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-cyan-400/20 via-cyan-400/60 to-cyan-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>

      {/* Tarjeta de acceso rápido a Ganancias */}
      <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-br from-teal-100 to-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100/0 via-teal-100/20 to-teal-100/0 animate-shine"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-teal-600" />
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
        
        <div className="h-2 w-full bg-gradient-to-r from-teal-400/20 via-teal-400/60 to-teal-400/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
    </div>
  );
};
