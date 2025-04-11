
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/auth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickAccessCards } from '@/components/dashboard/QuickAccessCards';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedResourceHub } from '@/components/dashboard/EnhancedResourceHub';
import { EnhancedActivityFeed } from '@/components/dashboard/EnhancedActivityFeed';
import { BusinessInsights } from '@/components/dashboard/BusinessInsights';
import { DashboardCustomization } from '@/components/dashboard/DashboardCustomization';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const { stats, loading, fetchDashboardData } = useDashboardData();
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [dataRefreshing, setDataRefreshing] = useState(false);
  
  const handleRefreshData = async () => {
    setDataRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setDataRefreshing(false), 1000);
  };
  
  useEffect(() => {
    // Check local storage for compact mode preference
    const storedCompactMode = localStorage.getItem('dashboardCompactMode');
    if (storedCompactMode) {
      setIsCompactMode(storedCompactMode === 'true');
    }
  }, []);
  
  const toggleCompactMode = () => {
    const newMode = !isCompactMode;
    setIsCompactMode(newMode);
    localStorage.setItem('dashboardCompactMode', newMode.toString());
  };
  
  // Layout variants based on compact mode
  const containerVariants = {
    normal: { gap: "2rem" },
    compact: { gap: "1rem" }
  };
  
  return (
    <MainLayout>
      <motion.div 
        className="py-6 px-4"
        initial={false}
        animate={isCompactMode ? "compact" : "normal"}
        variants={containerVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">Bienvenido al Dashboard</h1>
            <p className="text-muted-foreground">Gestiona tus transfers, gastos y ganancias desde un solo lugar.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshData}
              disabled={dataRefreshing}
              className="relative overflow-hidden"
            >
              {dataRefreshing && (
                <span className="absolute inset-0 bg-primary/10 animate-pulse"></span>
              )}
              {dataRefreshing ? 'Actualizando...' : 'Actualizar Datos'}
            </Button>
            
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
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold mb-1">Acceso Administrador</CardTitle>
                  <p className="text-sm text-muted-foreground">Tienes acceso a funciones administrativas exclusivas.</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/users">
                    Gestionar Usuarios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}
        
        {/* KPI Stats Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Resumen Financiero</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profits" className="flex items-center gap-1.5 text-muted-foreground">
                Ver Detalles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="border shadow-sm">
                  <CardHeader className="p-6">
                    <Skeleton className="h-5 w-20 mb-4" />
                    <Skeleton className="h-10 w-28 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardHeader>
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
        
        {/* Business Insights Section */}
        <div className="mb-10">
          <BusinessInsights />
        </div>
        
        {/* Activity & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <EnhancedActivityFeed />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Próximos Transfers
              </CardTitle>
            </CardHeader>
            <CardHeader className="pt-0">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Tienes 3 transfers programados para los próximos 2 días.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/transfers">
                    Ver Calendario
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
        
        {/* Resources & Information Section */}
        <div className="mb-8">
          <EnhancedResourceHub />
        </div>
      </motion.div>
      
      {/* Dashboard Customization Component */}
      <DashboardCustomization 
        onToggleCompactMode={toggleCompactMode}
        onRefreshData={handleRefreshData}
        isCompactMode={isCompactMode}
      />
    </MainLayout>
  );
};

export default Index;
