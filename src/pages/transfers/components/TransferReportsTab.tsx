
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransfersReportTable } from '@/components/reports/transfers/TransfersReportTable';
import { TransfersSummary } from '@/components/reports/transfers/TransfersSummary';
import { TransfersPageHeader } from '@/components/reports/transfers/TransfersPageHeader';
import { Transfer } from '@/types';
import { Expense } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="flex justify-end mb-4">
        <TransfersPageHeader onExportCSV={onExportCSV} onPrint={onPrint} />
      </div>
      
      <Tabs defaultValue="table" className="w-full px-[9px]">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="table" className="flex-1 sm:flex-initial">Tabla de Transfers</TabsTrigger>
          <TabsTrigger value="summary" className="flex-1 sm:flex-initial">Resumen</TabsTrigger>
          <TabsTrigger value="expenses" className="flex-1 sm:flex-initial">Gastos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Transfers</CardTitle>
            </CardHeader>
            <CardContent className={`px-0 ${isMobile ? "" : "sm:px-6"}`}>
              <div className={isMobile ? "overflow-x-auto -mx-4 px-4 mobile-scroll" : ""}>
                <TransfersReportTable transfers={transfers} loading={loading} />
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
              <TransfersSummary transfers={transfers} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Asociados</CardTitle>
            </CardHeader>
            <CardContent className={`px-0 ${isMobile ? "" : "sm:px-6"}`}>
              <div className={isMobile ? "overflow-x-auto -mx-4 px-4 mobile-scroll" : ""}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Fecha</th>
                      <th className="text-left p-2">Concepto</th>
                      <th className="text-right p-2">Importe</th>
                      <th className="text-left p-2">Transfer ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted-foreground">
                          No hay gastos registrados
                        </td>
                      </tr>
                    ) : (
                      expenses.map(expense => (
                        <tr key={expense.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{expense.date}</td>
                          <td className="p-2">{expense.concept}</td>
                          <td className="p-2 text-right font-medium">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(expense.amount)}
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {expense.transferId ? expense.transferId.slice(0, 8) + '...' : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td colSpan={2} className="p-2 font-medium text-right">Total:</td>
                      <td className="p-2 font-bold text-right">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
