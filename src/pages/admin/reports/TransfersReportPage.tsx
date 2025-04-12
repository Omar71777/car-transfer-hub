
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadCSVFromData, printProfitReport } from '@/lib/exports';
import { useAuth } from '@/contexts/auth';
import { TransfersPageHeader } from '@/components/reports/transfers/TransfersPageHeader';
import { TransfersReportTable } from '@/components/reports/transfers/TransfersReportTable';
import { TransfersSummary } from '@/components/reports/transfers/TransfersSummary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

const TransfersReportPage = () => {
  const {
    transfers,
    loading
  } = useTransfers();
  const {
    expenses
  } = useExpenses();
  const {
    profile
  } = useAuth();
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
    downloadCSVFromData(data, 'transfers-report.csv');
  };

  const handlePrint = () => {
    const totalIncome = transfers.reduce((sum, t) => sum + t.price, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalCommissions = transfers.reduce((sum, t) => sum + t.price * t.commission / 100, 0);
    const netProfit = totalIncome - totalExpenses - totalCommissions;
    const profitMargin = totalIncome > 0 ? netProfit / totalIncome * 100 : 0;
    const stats = {
      totalIncome,
      totalExpenses,
      totalCommissions,
      netProfit,
      profitMargin
    };
    printProfitReport('Informe de Transfers', transfers, expenses, stats, {
      name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
      email: profile?.email || ''
    });
  };

  const TableWrapper = ({ children }: { children: React.ReactNode }) => {
    return isMobile ? (
      <div className="overflow-x-auto -mx-4 px-4 mobile-scroll">
        {children}
      </div>
    ) : (
      <ScrollArea className="w-full">
        <div className="table-scroll-container">
          {children}
        </div>
      </ScrollArea>
    );
  };

  return (
    <MainLayout>
      <div className="py-6">
        <TransfersPageHeader onExportCSV={handleExportCSV} onPrint={handlePrint} />

        <Tabs defaultValue="table" className="w-full px-[9px]">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="table" className="flex-1 sm:flex-initial">Tabla de Transfers</TabsTrigger>
            <TabsTrigger value="summary" className="flex-1 sm:flex-initial">Resumen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Transfers</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "px-0" : "px-6"}>
                <TableWrapper>
                  <TransfersReportTable transfers={transfers} loading={loading} />
                </TableWrapper>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <TransfersSummary transfers={transfers} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TransfersReportPage;
