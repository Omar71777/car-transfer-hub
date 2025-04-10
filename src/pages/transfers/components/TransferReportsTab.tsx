
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransfersReportTable } from '@/components/reports/transfers/TransfersReportTable';
import { TransfersSummary } from '@/components/reports/transfers/TransfersSummary';
import { TransfersPageHeader } from '@/components/reports/transfers/TransfersPageHeader';
import { Transfer } from '@/types';
import { Expense } from '@/types';

interface TransferReportsTabProps {
  transfers: Transfer[];
  expenses: Expense[];
  loading: boolean;
  onExportCSV: () => void;
  onPrint: () => void;
}

export function TransferReportsTab({
  transfers,
  expenses,
  loading,
  onExportCSV,
  onPrint
}: TransferReportsTabProps) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <TransfersPageHeader onExportCSV={onExportCSV} onPrint={onPrint} />
      </div>
      
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
            <CardContent className="px-0 sm:px-6">
              <TransfersReportTable transfers={transfers} loading={loading} />
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
    </>
  );
}
