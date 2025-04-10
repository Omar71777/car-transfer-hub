
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTransfers } from '@/hooks/useTransfers';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { UnpaidTransfersTable } from '@/components/reports/UnpaidTransfersTable';
import { UnpaidCollaboratorSummary } from '@/components/reports/UnpaidCollaboratorSummary';
import { useCollaborators } from '@/hooks/useCollaborators';
import { Printer, FileDown } from 'lucide-react';
import { printUnpaidReport } from '@/lib/exports/printUnpaidReport';
import { downloadCSV } from '@/lib/exports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/auth';

const UnpaidTransfersPage = () => {
  const { transfers, loading } = useTransfers();
  const { collaborators } = useCollaborators();
  const { profile } = useAuth();
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('all');
  const [unpaidTransfers, setUnpaidTransfers] = useState<Transfer[]>([]);
  
  // Filter transfers for unpaid ones
  useEffect(() => {
    const filtered = transfers.filter(t => t.paymentStatus === 'pending');
    
    if (selectedCollaborator === 'all') {
      setUnpaidTransfers(filtered);
    } else {
      setUnpaidTransfers(filtered.filter(t => t.collaborator === selectedCollaborator));
    }
  }, [transfers, selectedCollaborator]);
  
  // Get unique collaborators from unpaid transfers
  const getUnpaidCollaborators = () => {
    const collaboratorNames = Array.from(
      new Set(transfers.filter(t => t.paymentStatus === 'pending').map(t => t.collaborator))
    ).filter(Boolean) as string[];
    
    return collaboratorNames;
  };
  
  // Calculate total unpaid amount for a collaborator
  const calculateUnpaidTotal = (collaboratorName: string) => {
    return transfers
      .filter(t => t.paymentStatus === 'pending' && t.collaborator === collaboratorName)
      .reduce((sum, t) => sum + (t.price * t.commission / 100), 0);
  };
  
  // Group unpaid transfers by month for each collaborator
  const getMonthlyUnpaidData = () => {
    const collaboratorNames = getUnpaidCollaborators();
    const monthlyData: any[] = [];
    
    collaboratorNames.forEach(name => {
      if (!name) return;
      
      const collaboratorTransfers = transfers.filter(
        t => t.paymentStatus === 'pending' && t.collaborator === name
      );
      
      // Group by month
      const monthGroups: Record<string, Transfer[]> = {};
      
      collaboratorTransfers.forEach(transfer => {
        try {
          const date = new Date(transfer.date);
          const monthYear = format(date, 'MMMM yyyy');
          
          if (!monthGroups[monthYear]) {
            monthGroups[monthYear] = [];
          }
          
          monthGroups[monthYear].push(transfer);
        } catch (error) {
          console.error('Error parsing date:', transfer.date);
        }
      });
      
      // Calculate total for each month
      Object.entries(monthGroups).forEach(([month, monthTransfers]) => {
        const total = monthTransfers.reduce((sum, t) => sum + (t.price * t.commission / 100), 0);
        
        monthlyData.push({
          collaborator: name,
          month,
          transferCount: monthTransfers.length,
          total,
          transfers: monthTransfers
        });
      });
    });
    
    return monthlyData;
  };
  
  const handlePrint = () => {
    const monthlyUnpaidData = getMonthlyUnpaidData();
    
    printUnpaidReport(
      'Informe de Pagos Pendientes a Colaboradores',
      selectedCollaborator === 'all' ? monthlyUnpaidData : monthlyUnpaidData.filter(d => d.collaborator === selectedCollaborator),
      {
        name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
        email: profile?.email || ''
      }
    );
  };
  
  const handleExportCSV = () => {
    const data = unpaidTransfers.map(transfer => ({
      Fecha: transfer.date,
      Colaborador: transfer.collaborator || 'N/A',
      Origen: transfer.origin,
      Destino: transfer.destination,
      Precio: transfer.price,
      Comisión: `${transfer.commission}%`,
      'Importe Comisión': (transfer.price * transfer.commission / 100).toFixed(2) + '€'
    }));
    
    downloadCSV(data, 'pagos-pendientes.csv');
  };
  
  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-primary">Pagos Pendientes</h1>
            <p className="text-muted-foreground">Gestión de pagos pendientes a colaboradores</p>
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
        
        <Card className="mb-6">
          <CardContent className="py-4 mt-4">
            <div className="flex items-center">
              <div className="w-64">
                <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los colaboradores</SelectItem>
                    {collaborators.map((collab) => (
                      <SelectItem key={collab.id} value={collab.name}>
                        {collab.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="table">
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
