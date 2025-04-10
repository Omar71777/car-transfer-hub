
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
import { InformationSection } from '@/components/dashboard/InformationSection';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading } = useDashboardData();
  
  return (
    <MainLayout>
      <div className="py-4 md:py-6 px-2 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-primary text-left">Bienvenido a Ibiza Transfer Hub</h1>
        <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base text-left">Gestiona tus transfers, gastos y ganancias desde un solo lugar.</p>
        
        {isAdmin && (
          <Card className="glass-card mb-6 md:mb-8 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 text-left">Acceso Administrador</h3>
                  <p className="text-xs md:text-sm text-muted-foreground text-left">Tienes acceso a funciones administrativas exclusivas.</p>
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
        <div className="mb-8 md:mb-10">
          <h2 className="text-xl font-semibold mb-3 md:mb-4 text-primary text-left">Resumen de Actividad</h2>
          <StatCards stats={stats} />
        </div>
        
        {/* Quick Access Cards */}
        <QuickAccessCards />
        
        {/* Information Section */}
        <div className="mb-8 md:mb-12 mt-8 md:mt-12">
          <InformationSection />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
