
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, CreditCard, BarChart2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isAdmin } = useAuth();

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-2 text-ibiza-900">Bienvenido a Ibiza Transfer Hub</h1>
        <p className="text-muted-foreground mb-8">Gestiona tus transfers, gastos, ganancias y turnos desde un solo lugar.</p>
        
        {isAdmin && (
          <Card className="glass-card mb-8 bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Acceso Administrador</h3>
                  <p className="text-sm text-muted-foreground">Tienes acceso a funciones administrativas exclusivas.</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/users">
                    Gestionar Usuarios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Tarjeta de acceso rápido a Nuevos Transfers */}
          <Card className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-ibiza-500" />
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
                <Calendar className="h-5 w-5 text-ibiza-500" />
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
                <CreditCard className="h-5 w-5 text-ibiza-500" />
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
                <BarChart2 className="h-5 w-5 text-ibiza-500" />
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

        <div className="relative overflow-hidden rounded-xl p-6 glass-card bg-gradient-to-r from-ibiza-500 to-ibiza-600 text-white shadow-lg mb-8">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative">
            <h2 className="text-xl font-bold mb-2">Maximiza tus ganancias</h2>
            <p className="max-w-3xl mb-4">
              Controla tus transfers, gastos y turnos de forma eficiente para optimizar tu operación en Ibiza.
            </p>
            <Button asChild variant="secondary">
              <Link to="/transfers">Comienza ahora</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Próximos Turnos</CardTitle>
              <CardDescription>Consulta los próximos días de trabajo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gestiona tus turnos de 12 y 24 horas fácilmente con nuestro calendario.
              </p>
              <Button asChild variant="outline">
                <Link to="/shifts">Ver Calendario de Turnos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>¿Necesitas ayuda?</CardTitle>
              <CardDescription>Recursos para utilizar la aplicación</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explora todas las funcionalidades de Ibiza Transfer Hub para sacar el máximo provecho.
              </p>
              <Button variant="outline">Ver Guía de Uso</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
