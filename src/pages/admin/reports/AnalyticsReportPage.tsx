
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/reports/analytics/PageHeader';
import { MonthlyEvolutionChart } from '@/components/reports/analytics/MonthlyEvolutionChart';
import { CollaboratorDistributionChart } from '@/components/reports/analytics/CollaboratorDistributionChart';
import { StatsOverview } from '@/components/reports/analytics/StatsOverview';
import { useAnalyticsData } from '@/hooks/reports/useAnalyticsData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

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

  return (
    <MainLayout>
      <div className="py-6">
        <PageHeader />
        
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="monthly">Evolución Mensual</TabsTrigger>
            <TabsTrigger value="distribution">Colaboradores</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="destinations">Destinos</TabsTrigger>
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
          
          <TabsContent value="clients">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Ingresos por Cliente</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Cargando datos...</p>
                    </div>
                  ) : clientData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p>No hay datos disponibles</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientData.slice(0, 8)}
                          cx="50%"
                          cy="50%"
                          labelLine={!isMobile}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={!isMobile && ((entry) => `${entry.name}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(entry.value)}`)}
                        >
                          {clientData.slice(0, 8).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={isMobile ? "overflow-x-auto -mx-4 px-4 mobile-scroll" : ""}>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Cliente</th>
                          <th className="text-right py-2">Transfers</th>
                          <th className="text-right py-2">Importe Total</th>
                          <th className="text-right py-2">Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientData.slice(0, 10).map((client, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{client.name}</td>
                            <td className="py-2 text-right">{client.count}</td>
                            <td className="py-2 text-right font-medium">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(client.value)}
                            </td>
                            <td className="py-2 text-right">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(client.value / client.count)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="destinations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Destinos Más Populares</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Cargando datos...</p>
                    </div>
                  ) : destinationsData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p>No hay datos disponibles</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={destinationsData.slice(0, 8)}
                          cx="50%"
                          cy="50%"
                          labelLine={!isMobile}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={!isMobile && ((entry) => `${entry.name}: ${entry.value}`)}
                        >
                          {destinationsData.slice(0, 8).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Destinos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={isMobile ? "overflow-x-auto -mx-4 px-4 mobile-scroll" : ""}>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Destino</th>
                          <th className="text-right py-2">Número de Viajes</th>
                          <th className="text-right py-2">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {destinationsData.slice(0, 10).map((destination, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 capitalize">{destination.name}</td>
                            <td className="py-2 text-right">{destination.value}</td>
                            <td className="py-2 text-right">
                              {((destination.value / transfers.length) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
