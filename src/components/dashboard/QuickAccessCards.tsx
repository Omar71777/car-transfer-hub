
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, CreditCard, BarChart2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const QuickAccessCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Tarjeta de acceso rápido a Nuevos Transfers */}
      <Card className="glass-card hover:shadow-lg transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
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
      </Card>

      {/* Tarjeta de acceso rápido a Transfers */}
      <Card className="glass-card hover:shadow-lg transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
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
      </Card>

      {/* Tarjeta de acceso rápido a Gastos */}
      <Card className="glass-card hover:shadow-lg transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
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
      </Card>

      {/* Tarjeta de acceso rápido a Ganancias */}
      <Card className="glass-card hover:shadow-lg transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
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
      </Card>
    </div>
  );
};
