import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TableCaption 
} from '@/components/ui/table';
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadCSV, printProfitReport } from '@/lib/exports';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const TransfersReportPage = () => {
  const { transfers, loading } = useTransfers();
  const { expenses } = useExpenses();
  const { profile } = useAuth();

  const handleExportCSV = () => {
    const data = transfers.map(transfer => ({
      Fecha: transfer.date,
      Hora: transfer.time || 'N/A',
      Origen: transfer.origin,
      Destino: transfer.destination,
      Precio: transfer.price,
      Colaborador: transfer.collaborator || 'N/A',
      Comisión: transfer.commission + '%'
    }));

    downloadCSV(data, 'transfers-report.csv');
  };

  const handlePrint = () => {
    // Calculate total income from transfers
    const totalIncome = transfers.reduce((sum, t) => sum + t.price, 0);
    
    // Correctly calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Calculate commissions
    const totalCommissions = transfers.reduce(
      (sum, t) => sum + (t.price * t.commission / 100), 
      0
    );
    
    // Calculate net profit: income - expenses - commissions
    const netProfit = totalIncome - totalExpenses - totalCommissions;
    
    // Calculate profit margin
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    const stats = {
      totalIncome,
      totalExpenses,
      totalCommissions,
      netProfit,
      profitMargin
    };
    
    // Pass user information and ALL expenses
    printProfitReport(
      'Informe de Transfers', 
      transfers, 
      expenses, 
      stats, 
      {
        name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
        email: profile?.email || ''
      }
    );
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-primary">Informes de Transfers</h1>
            <p className="text-muted-foreground">Análisis detallado de los transfers realizados</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Tabla de Transfers</TabsTrigger>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Lista de todos los transfers registrados</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Precio (€)</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Comisión</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">Cargando...</TableCell>
                      </TableRow>
                    ) : transfers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">No hay transfers registrados</TableCell>
                      </TableRow>
                    ) : (
                      transfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>{transfer.date}</TableCell>
                          <TableCell>{transfer.time || 'N/A'}</TableCell>
                          <TableCell>{transfer.origin}</TableCell>
                          <TableCell>{transfer.destination}</TableCell>
                          <TableCell>{transfer.price}€</TableCell>
                          <TableCell>{transfer.collaborator || 'N/A'}</TableCell>
                          <TableCell>{transfer.commission}%</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Total Transfers</h3>
                    <p className="mt-2 text-3xl font-semibold">{transfers.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
                    <p className="mt-2 text-3xl font-semibold">
                      {transfers.reduce((sum, t) => sum + t.price, 0).toFixed(2)}€
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Comisiones Totales</h3>
                    <p className="mt-2 text-3xl font-semibold">
                      {transfers.reduce((sum, t) => sum + (t.price * t.commission / 100), 0).toFixed(2)}€
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Precio Promedio</h3>
                    <p className="mt-2 text-3xl font-semibold">
                      {transfers.length > 0 
                        ? (transfers.reduce((sum, t) => sum + t.price, 0) / transfers.length).toFixed(2) 
                        : 0}€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TransfersReportPage;
