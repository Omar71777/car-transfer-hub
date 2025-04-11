
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransfers } from '@/hooks/useTransfers';
import { UnpaidTransfersTable } from '@/components/reports/UnpaidTransfersTable';
import { UnpaidCollaboratorSummary } from '@/components/reports/UnpaidCollaboratorSummary';
import { useCollaborators } from '@/hooks/useCollaborators';
import { printUnpaidReport } from '@/lib/exports/printUnpaidReport';
import { downloadCSVFromData, prepareUnpaidDataForExport, prepareUnpaidSummaryForExport } from '@/lib/exports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { UnpaidPageHeader } from '@/components/reports/unpaid/UnpaidPageHeader';
import { CollaboratorFilter } from '@/components/reports/unpaid/CollaboratorFilter';
import { useUnpaidTransfersData } from '@/hooks/useUnpaidTransfersData';
import { toast } from 'sonner';

const UnpaidTransfersPage = () => {
  const {
    transfers,
    loading: transfersLoading,
    fetchTransfers
  } = useTransfers();
  
  const {
    collaborators,
    loading: collaboratorsLoading
  } = useCollaborators();
  
  const {
    profile
  } = useAuth();
  
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('table');

  // Ensure transfers are fetched when the component mounts
  useEffect(() => {
    fetchTransfers().catch(error => {
      console.error('Failed to fetch transfers:', error);
      toast.error('Error al cargar los transfers');
    });
  }, [fetchTransfers]);

  const {
    unpaidTransfers,
    getMonthlyUnpaidData
  } = useUnpaidTransfersData(transfers, selectedCollaborator);
  
  const loading = transfersLoading || collaboratorsLoading;
  
  const handlePrint = () => {
    const monthlyUnpaidData = getMonthlyUnpaidData();
    printUnpaidReport('Informe de Pagos Pendientes a Colaboradores', 
      selectedCollaborator === 'all' ? 
        monthlyUnpaidData : 
        monthlyUnpaidData.filter(d => d.collaborator === selectedCollaborator), 
      {
        name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
        email: profile?.email || ''
      }
    );
  };
  
  const handleExportCSV = () => {
    if (activeTab === 'table') {
      const data = prepareUnpaidDataForExport(unpaidTransfers);
      downloadCSVFromData(data, 'pagos-pendientes-detalle.csv');
    } else {
      const data = prepareUnpaidSummaryForExport(getMonthlyUnpaidData());
      downloadCSVFromData(data, 'pagos-pendientes-resumen.csv');
    }
  };
  
  return (
    <MainLayout>
      <div className="container py-6 px-4 md:px-6">
        <UnpaidPageHeader onExportCSV={handleExportCSV} onPrint={handlePrint} />
        
        <CollaboratorFilter 
          collaborators={collaborators} 
          selectedCollaborator={selectedCollaborator} 
          onCollaboratorChange={setSelectedCollaborator} 
        />
        
        <Tabs defaultValue="table" onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="table" className="flex-1 md:flex-none">Transfers Pendientes</TabsTrigger>
            <TabsTrigger value="summary" className="flex-1 md:flex-none">Resumen por Colaborador</TabsTrigger>
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
                <UnpaidCollaboratorSummary 
                  monthlyData={getMonthlyUnpaidData()} 
                  loading={loading} 
                  selectedCollaborator={selectedCollaborator} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UnpaidTransfersPage;
