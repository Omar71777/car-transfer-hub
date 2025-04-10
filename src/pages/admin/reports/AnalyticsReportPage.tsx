
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';

const AnalyticsReportPage = () => {
  const { transfers, loading: transfersLoading } = useTransfers();
  const { expenses, loading: expensesLoading } = useExpenses();
  
  // Generate monthly data
  const generateMonthlyData = () => {
    const months: Record<string, {
      name: string;
      ingresos: number;
      gastos: number;
      comisiones: number;
      beneficio: number;
    }> = {};
    
    // Process transfers
    transfers.forEach(transfer => {
      const date = new Date(transfer.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const monthName = date.toLocaleString('es-ES', { month: 'short' });
      
      if (!months[monthYear]) {
        months[monthYear] = {
          name: monthName,
          ingresos: 0,
          gastos: 0,
          comisiones: 0,
          beneficio: 0
        };
      }
      
      months[monthYear].ingresos += transfer.price;
      const commission = (transfer.price * transfer.commission) / 100;
      months[monthYear].comisiones += commission;
    });
    
    // Process expenses
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      
      if (months[monthYear]) {
        months[monthYear].gastos += expense.amount;
      }
    });
    
    // Calculate profit
    Object.values(months).forEach(month => {
      month.beneficio = month.ingresos - (month.gastos + month.comisiones);
    });
    
    return Object.values(months);
  };
  
  // Generate data for collaborator distribution
  const generateCollaboratorData = () => {
    const collaborators: Record<string, number> = {};
    
    // Filter transfers with collaborators
    const transfersWithCollaborators = transfers.filter(transfer => 
      transfer.collaborator && transfer.collaborator.trim() !== ''
    );
    
    transfersWithCollaborators.forEach(transfer => {
      const collaborator = transfer.collaborator || 'Sin colaborador';
      if (!collaborators[collaborator]) {
        collaborators[collaborator] = 0;
      }
      collaborators[collaborator] += transfer.price;
    });
    
    return Object.entries(collaborators).map(([name, value]) => ({ name, value }));
  };
  
  const monthlyData = generateMonthlyData();
  const collaboratorData = generateCollaboratorData();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#83a6ed'];
  
  const loading = transfersLoading || expensesLoading;

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Análisis</h1>
          <p className="text-muted-foreground">Informes analíticos y estadísticas de rendimiento</p>
        </div>
        
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
                {loading ? (
                  <div className="flex justify-center items-center h-80">
                    <p>Cargando datos...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}€`} />
                      <Legend />
                      <Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" />
                      <Bar dataKey="gastos" name="Gastos" fill="#ef4444" />
                      <Bar dataKey="comisiones" name="Comisiones" fill="#f59e0b" />
                      <Bar dataKey="beneficio" name="Beneficio" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
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
                  {loading ? (
                    <div className="flex justify-center items-center h-80">
                      <p>Cargando datos...</p>
                    </div>
                  ) : collaboratorData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={collaboratorData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {collaboratorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}€`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex justify-center items-center h-80">
                      <p>No hay datos de colaboradores disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Generales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Total Transfers</h3>
                      <p className="mt-2 text-2xl font-semibold">{transfers.length}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
                      <p className="mt-2 text-2xl font-semibold">
                        {transfers.reduce((sum, t) => sum + t.price, 0).toFixed(2)}€
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500">Gastos Totales</h3>
                      <p className="mt-2 text-2xl font-semibold">
                        {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}€
                      </p>
                    </div>
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
