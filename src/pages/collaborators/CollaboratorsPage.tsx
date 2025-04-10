
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollaboratorCard } from '@/components/collaborators/CollaboratorCard';
import { CollaboratorsOverview } from '@/components/collaborators/CollaboratorsOverview';
import { CollaboratorManagement } from '@/components/collaborators/CollaboratorManagement';
import { Transfer } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollaborators } from '@/hooks/useCollaborators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type MonthlyCollaboratorStats = {
  month: string;
  collaborator: string;
  transferCount: number;
  commissionTotal: number;
};

const CollaboratorsPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [collaboratorStats, setCollaboratorStats] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyCollaboratorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { collaborators } = useCollaborators();

  useEffect(() => {
    // Cargar transfers desde Supabase
    const loadTransfers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('transfers')
          .select('id, date, time, origin, destination, price, collaborator, commission')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // Transform the transfers data to match our Transfer type
        const processedTransfers = data.map((transfer: any) => ({
          id: transfer.id,
          date: transfer.date,
          time: transfer.time || '',
          origin: transfer.origin,
          destination: transfer.destination,
          price: Number(transfer.price),
          collaborator: transfer.collaborator || '',
          commission: Number(transfer.commission),
          expenses: [] // Add empty expenses array to match Transfer type
        }));
        
        setTransfers(processedTransfers);
        
        // Calculate collaborator stats
        calculateCollaboratorStats(processedTransfers);
        
        // Generate monthly stats
        generateMonthlyStats(processedTransfers);
      } catch (error: any) {
        console.error('Error loading transfers:', error);
        toast.error(`Error al cargar los transfers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransfers();
  }, [collaborators]); // Re-calculate when collaborators change

  const calculateCollaboratorStats = (loadedTransfers: Transfer[]) => {
    const stats: Record<string, { 
      name: string, 
      transferCount: number, 
      commissionTotal: number,
      transfers: Transfer[]
    }> = {};
    
    loadedTransfers.forEach((transfer: Transfer) => {
      if (!transfer.collaborator) return;
      
      const commissionAmount = (transfer.price * transfer.commission) / 100;
      
      if (!stats[transfer.collaborator]) {
        stats[transfer.collaborator] = {
          name: transfer.collaborator,
          transferCount: 0,
          commissionTotal: 0,
          transfers: []
        };
      }
      
      stats[transfer.collaborator].transferCount += 1;
      stats[transfer.collaborator].commissionTotal += commissionAmount;
      stats[transfer.collaborator].transfers.push(transfer);
    });
    
    const collaboratorsData = Object.values(stats).map(collab => ({
      ...collab,
      averageCommission: collab.commissionTotal / collab.transferCount || 0
    }));
    
    // Sort by total commission, descending
    collaboratorsData.sort((a, b) => b.commissionTotal - a.commissionTotal);
    
    setCollaboratorStats(collaboratorsData);
  };
  
  const generateMonthlyStats = (loadedTransfers: Transfer[]) => {
    const monthlyData: Record<string, Record<string, MonthlyCollaboratorStats>> = {};
    
    loadedTransfers.forEach((transfer: Transfer) => {
      if (!transfer.collaborator || !transfer.date) return;
      
      // Get month and year from date (format: YYYY-MM-DD)
      const dateParts = transfer.date.split('-');
      if (dateParts.length < 2) return;
      
      const year = dateParts[0];
      const month = dateParts[1];
      const monthYear = `${year}-${month}`;
      const monthDisplay = new Date(`${year}-${month}-01`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      
      // Get commission amount
      const commissionAmount = (transfer.price * transfer.commission) / 100;
      
      // Initialize month data if it doesn't exist
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {};
      }
      
      // Initialize collaborator data for this month if it doesn't exist
      if (!monthlyData[monthYear][transfer.collaborator]) {
        monthlyData[monthYear][transfer.collaborator] = {
          month: monthDisplay,
          collaborator: transfer.collaborator,
          transferCount: 0,
          commissionTotal: 0
        };
      }
      
      // Update the stats
      monthlyData[monthYear][transfer.collaborator].transferCount += 1;
      monthlyData[monthYear][transfer.collaborator].commissionTotal += commissionAmount;
    });
    
    // Convert the nested object to an array
    const monthlyStatsArray: MonthlyCollaboratorStats[] = [];
    Object.keys(monthlyData).forEach(monthYear => {
      Object.keys(monthlyData[monthYear]).forEach(collaborator => {
        monthlyStatsArray.push(monthlyData[monthYear][collaborator]);
      });
    });
    
    // Sort by month (descending) and then by commission total (descending)
    monthlyStatsArray.sort((a, b) => {
      if (a.month !== b.month) {
        return b.month.localeCompare(a.month); // Sort by month desc
      }
      return b.commissionTotal - a.commissionTotal; // Then by commission total desc
    });
    
    setMonthlyStats(monthlyStatsArray);
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Colaboradores</h1>
          <p className="text-muted-foreground">Gestión y análisis de colaboradores</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="management">Gestionar Colaboradores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            {/* Collaborators Overview */}
            <div>
              <CollaboratorsOverview transfers={transfers} />
            </div>

            {/* Collaborator Cards */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Rendimiento por Colaborador</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaboratorStats.map((collab) => (
                  <CollaboratorCard
                    key={collab.name}
                    name={collab.name}
                    transferCount={collab.transferCount}
                    commissionTotal={collab.commissionTotal}
                    averageCommission={collab.averageCommission}
                  />
                ))}
                {collaboratorStats.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No hay datos de colaboradores disponibles
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Totals Table */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Comisiones Mensuales por Colaborador</CardTitle>
                <CardDescription>Resumen mensual de transfers y comisiones por colaborador</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mes</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead className="text-right">Cantidad de Transfers</TableHead>
                      <TableHead className="text-right">Total Comisión</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyStats.map((stat, index) => (
                      <TableRow key={`${stat.month}-${stat.collaborator}-${index}`}>
                        <TableCell>{stat.month}</TableCell>
                        <TableCell>{stat.collaborator}</TableCell>
                        <TableCell className="text-right">{stat.transferCount}</TableCell>
                        <TableCell className="text-right font-medium text-amber-500">
                          {formatCurrency(stat.commissionTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {monthlyStats.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No hay datos mensuales disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="management">
            <CollaboratorManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CollaboratorsPage;
