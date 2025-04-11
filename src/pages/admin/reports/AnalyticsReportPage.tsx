
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/reports/analytics/PageHeader';
import { useAnalyticsData } from '@/hooks/reports/useAnalyticsData';
import { useIsMobile } from '@/hooks/use-mobile';
import { MonthlyTab } from '@/components/reports/analytics/tabs/MonthlyTab';
import { DistributionTab } from '@/components/reports/analytics/tabs/DistributionTab';
import { ClientsTab } from '@/components/reports/analytics/tabs/ClientsTab';
import { DestinationsTab } from '@/components/reports/analytics/tabs/DestinationsTab';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AnalyticsReportPage = () => {
  const { 
    transfers, 
    expenses, 
    clientData, 
    destinationsData,
    monthlyData, 
    collaboratorData, 
    loading,
    error,
    handleRetry 
  } = useAnalyticsData();
  
  const isMobile = useIsMobile();

  return (
    <MainLayout>
      <div className="py-6">
        <PageHeader />
        
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error al cargar los datos</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error}</p>
              <Button 
                variant="outline"
                size="sm"
                className="w-fit mt-2 flex items-center gap-2"
                onClick={handleRetry}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="monthly">Evolución Mensual</TabsTrigger>
              <TabsTrigger value="distribution">Colaboradores</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="destinations">Destinos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly">
              <MonthlyTab 
                monthlyData={monthlyData} 
                loading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="distribution">
              <DistributionTab 
                collaboratorData={collaboratorData} 
                transfers={transfers}
                expenses={expenses}
                loading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="clients">
              <ClientsTab 
                clientData={clientData} 
                loading={loading} 
                isMobile={isMobile} 
              />
            </TabsContent>
            
            <TabsContent value="destinations">
              <DestinationsTab 
                destinationsData={destinationsData} 
                transfers={transfers}
                loading={loading} 
                isMobile={isMobile} 
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default AnalyticsReportPage;
