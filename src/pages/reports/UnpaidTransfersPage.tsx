import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransfers } from '@/hooks/useTransfers';
import { UnpaidTransfersTable } from '@/components/reports/UnpaidTransfersTable';
import { UnpaidCollaboratorSummary } from '@/components/reports/UnpaidCollaboratorSummary';
import { useCollaborators } from '@/hooks/useCollaborators';
import { printUnpaidReport } from '@/lib/exports/printUnpaidReport';
import { downloadCSV, prepareUnpaidDataForExport, prepareUnpaidSummaryForExport } from '@/lib/exports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { UnpaidPageHeader } from '@/components/reports/unpaid/UnpaidPageHeader';
import { CollaboratorFilter } from '@/components/reports/unpaid/CollaboratorFilter';
import { useUnpaidTransfersData } from '@/hooks/useUnpaidTransfersData';
const UnpaidTransfersPage = () => {
  const {
    transfers,
    loading
  } = useTransfers();
  const {
    collaborators
  } = useCollaborators();
  const {
    profile
  } = useAuth();
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('table');

  // Use our custom hook to handle unpaid transfers data
  const {
    unpaidTransfers,
    getMonthlyUnpaidData
  } = useUnpaidTransfersData(transfers, selectedCollaborator);
  const handlePrint = () => {
    const monthlyUnpaidData = getMonthlyUnpaidData();
    printUnpaidReport('Informe de Pagos Pendientes a Colaboradores', selectedCollaborator === 'all' ? monthlyUnpaidData : monthlyUnpaidData.filter(d => d.collaborator === selectedCollaborator), {
      name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
      email: profile?.email || ''
    });
  };
  const handleExportCSV = () => {
    if (activeTab === 'table') {
      const data = prepareUnpaidDataForExport(unpaidTransfers);
      downloadCSV(data, 'pagos-pendientes-detalle.csv');
    } else {
      const data = prepareUnpaidSummaryForExport(getMonthlyUnpaidData());
      downloadCSV(data, 'pagos-pendientes-resumen.csv');
    }
  };
  return <MainLayout>
      <div className="py-6 px-[7px]">
        <UnpaidPageHeader onExportCSV={handleExportCSV} onPrint={handlePrint} />
        
        <CollaboratorFilter collaborators={collaborators} selectedCollaborator={selectedCollaborator} onCollaboratorChange={setSelectedCollaborator} />
        
        <Tabs defaultValue="table" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="table">Transfers Pendientes</TabsTrigger>
            <TabsTrigger value="summary">Resumen por Colaborador</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transfers Pendientes de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <UnpaidTransfersTable transfers={unpaidTransfers} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen por Colaborador y Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <UnpaidCollaboratorSummary monthlyData={getMonthlyUnpaidData()} loading={loading} selectedCollaborator={selectedCollaborator} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>;
};
export default UnpaidTransfersPage;