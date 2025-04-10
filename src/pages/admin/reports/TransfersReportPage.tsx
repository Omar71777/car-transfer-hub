
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TableCaption,
  TableFooter
} from '@/components/ui/table';
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadCSV, printProfitReport } from '@/lib/exports';
import { Button } from '@/components/ui/button';
import { FileDown, Printer, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TransfersReportPage = () => {
  const { transfers, loading } = useTransfers();
  const { expenses } = useExpenses();
  const { profile } = useAuth();
  const isMobile = useIsMobile();

  const handleExportCSV = () => {
    const data = transfers.map(transfer => ({
      Fecha: transfer.date,
      Hora: transfer.time || 'N/A',
      Origen: transfer.origin,
      Destino: transfer.destination,
      Precio: transfer.price,
      Colaborador: transfer.collaborator || 'N/A',
      Comisión: transfer.commission + '%',
      'Importe Comisión': (transfer.price * transfer.commission / 100).toFixed(2) + '€'
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

  // Calculate totals
  const totalPrice = transfers.reduce((sum, t) => sum + t.price, 0);
  const totalCommissions = transfers.reduce((sum, t) => sum + (t.price * t.commission / 100), 0);

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">Informes de Transfers</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Análisis detallado de los transfers realizados</p>
          </div>
          
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Acciones
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
          )}
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="table" className="flex-1 sm:flex-initial">Tabla de Transfers</TabsTrigger>
            <TabsTrigger value="summary" className="flex-1 sm:flex-initial">Resumen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Transfers</CardTitle>
              </CardHeader>
              <CardContent className="px-0 sm:px-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Lista de todos los transfers registrados</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        {!isMobile && <TableHead>Hora</TableHead>}
                        <TableHead className="max-w-[100px]">Origen</TableHead>
                        <TableHead className="max-w-[100px]">Destino</TableHead>
                        <TableHead className="text-right">Precio (€)</TableHead>
                        {!isMobile && <TableHead>Colaborador</TableHead>}
                        {!isMobile && <TableHead>Comisión (%)</TableHead>}
                        <TableHead className="text-right">Importe (€)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 5 : 8} className="text-center py-8">Cargando...</TableCell>
                        </TableRow>
                      ) : transfers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 5 : 8} className="text-center py-8">No hay transfers registrados</TableCell>
                        </TableRow>
                      ) : (
                        transfers.map((transfer) => {
                          const commissionAmount = transfer.price * transfer.commission / 100;
                          return (
                            <TableRow key={transfer.id}>
                              <TableCell>{transfer.date}</TableCell>
                              {!isMobile && <TableCell>{transfer.time || 'N/A'}</TableCell>}
                              <TableCell className="max-w-[100px] truncate" title={transfer.origin}>
                                {transfer.origin}
                              </TableCell>
                              <TableCell className="max-w-[100px] truncate" title={transfer.destination}>
                                {transfer.destination}
                              </TableCell>
                              <TableCell className="text-right">{formatCurrency(transfer.price)}</TableCell>
                              {!isMobile && <TableCell>{transfer.collaborator || 'N/A'}</TableCell>}
                              {!isMobile && <TableCell>{transfer.commission}</TableCell>}
                              <TableCell className="text-right">{formatCurrency(commissionAmount)}</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                    {transfers.length > 0 && (
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={isMobile ? 3 : 6} className="text-right font-bold">Totales:</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(totalPrice)}</TableCell>
                          {!isMobile && <TableCell></TableCell>}
                          <TableCell className="text-right font-bold">{formatCurrency(totalCommissions)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    )}
                  </Table>
                </div>
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
