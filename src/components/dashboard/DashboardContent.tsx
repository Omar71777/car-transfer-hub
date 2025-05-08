
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickAccessCards } from '@/components/dashboard/QuickAccessCards';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const DashboardContent = () => {
  const { user } = useAuth();
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
        
        {/* KPI Stats Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Resumen Financiero</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="border shadow-sm">
                  <div className="p-6">
                    <Skeleton className="h-5 w-20 mb-4" />
                    <Skeleton className="h-10 w-28 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
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
      </div>
    </MainLayout>
  );
};

export default DashboardContent;
