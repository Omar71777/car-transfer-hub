
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const AnalyticsReportPage = () => {
  const { 
    transfers, 
    expenses, 
    clientData, 
    destinationsData,
    monthlyData, 
    collaboratorData, 
    loading 
  } = useAnalyticsData();
  
  const isMobile = useIsMobile();

  const hasData = transfers.length > 0 || expenses.length > 0;

  return (
    <MainLayout>
      <div className="py-6 px-4">
        <PageHeader />
        
        {!loading && !hasData && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>No hay datos disponibles</AlertTitle>
            <AlertDescription>
              Para visualizar los informes analíticos, necesitas añadir transfers y gastos. 
              Vuelve a esta página cuando hayas registrado algunas operaciones.
            </AlertDescription>
          </Alert>
        )}
        
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
      </div>
    </MainLayout>
  );
};

export default AnalyticsReportPage;
