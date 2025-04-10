
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/reports/analytics/PageHeader';
import { MonthlyEvolutionChart } from '@/components/reports/analytics/MonthlyEvolutionChart';
import { CollaboratorDistributionChart } from '@/components/reports/analytics/CollaboratorDistributionChart';
import { StatsOverview } from '@/components/reports/analytics/StatsOverview';
import { useAnalyticsData } from '@/hooks/reports/useAnalyticsData';

const AnalyticsReportPage = () => {
  const { transfers, expenses, monthlyData, collaboratorData, loading } = useAnalyticsData();

  return (
    <MainLayout>
      <div className="py-6">
        <PageHeader />
        
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Evolución Mensual</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Evolución Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyEvolutionChart data={monthlyData} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Colaborador</CardTitle>
                </CardHeader>
                <CardContent>
                  <CollaboratorDistributionChart data={collaboratorData} loading={loading} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Generales</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatsOverview transfers={transfers} expenses={expenses} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AnalyticsReportPage;
