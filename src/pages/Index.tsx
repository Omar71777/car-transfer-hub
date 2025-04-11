
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, BarChart2, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickAccessCards } from '@/components/dashboard/QuickAccessCards';
import { InformationSection } from '@/components/dashboard/InformationSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading } = useDashboardData();
  
  return (
    <MainLayout>
      <div className="py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Bienvenido al Dashboard</h1>
            <p className="text-muted-foreground">Gestiona tus transfers, gastos y ganancias desde un solo lugar.</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button asChild variant="default">
              <Link to="/transfers/new">
                Nuevo Transfer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {isAdmin && (
          <Card className="glass-card mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50">
            <CardContent className="pt-6 pb-6">
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
        
        {/* KPI Stats Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Resumen Financiero</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profits" className="flex items-center gap-1.5 text-muted-foreground">
                <BarChart2 className="h-4 w-4" />
                Ver Detalles
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="border shadow-sm">
                  <CardContent className="p-6">
                    <Skeleton className="h-5 w-20 mb-4" />
                    <Skeleton className="h-10 w-28 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <StatCards stats={stats} />
          )}
        </div>
        
        {/* Quick Access Cards */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Acceso Rápido</h2>
          </div>
          <QuickAccessCards />
        </div>
        
        {/* Activity & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Los últimos movimientos en tu negocio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l border-border space-y-4">
                <div className="relative">
                  <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                  <div className="mb-1 text-sm font-medium">Nuevo Transfer Registrado</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Hoy, 14:30
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="mb-1 text-sm font-medium">Pago recibido</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Ayer, 10:15
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-amber-500"></div>
                  <div className="mb-1 text-sm font-medium">Nuevo gasto registrado</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    2 días atrás
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tendencias
              </CardTitle>
              <CardDescription>Evolución de tus ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Visita la sección de Informes para ver análisis detallados y gráficos de tendencias.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" asChild className="mt-4">
                  <Link to="/admin/reports/analytics">
                    Ver Análisis Completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Information Section */}
        <div className="mb-8">
          <InformationSection />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
