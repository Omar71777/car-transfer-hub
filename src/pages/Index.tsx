
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickAccessCards } from '@/components/dashboard/QuickAccessCards';
import { ShiftSection } from '@/components/dashboard/ShiftSection';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading } = useDashboardData();

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-2 text-primary">Bienvenido a Ibiza Transfer Hub</h1>
        <p className="text-muted-foreground mb-8">Gestiona tus transfers, gastos y ganancias desde un solo lugar.</p>
        
        {isAdmin && (
          <Card className="glass-card mb-8 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50">
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
        
        {/* KPI Stats Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-primary">Resumen de Actividad</h2>
          <StatCards stats={stats} />
        </div>
        
        {/* Quick Access Cards */}
        <QuickAccessCards />
        
        {/* Information Section */}
        <div className="mb-12 mt-12">
          <ShiftSection />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
