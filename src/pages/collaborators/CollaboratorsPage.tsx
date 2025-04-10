
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CollaboratorsOverview } from '@/components/collaborators/CollaboratorsOverview';
import { CollaboratorStatsSection } from '@/components/collaborators/CollaboratorStatsSection';
import { CollaboratorManagement } from '@/components/collaborators/CollaboratorManagement';
import { MonthlyStatsCard } from '@/components/collaborators/MonthlyStatsCard';
import { Transfer } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollaborators } from '@/hooks/useCollaborators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MonthlyCollaboratorStats, CollaboratorStat } from '@/components/collaborators/types';

const CollaboratorsPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [collaboratorStats, setCollaboratorStats] = useState<CollaboratorStat[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyCollaboratorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { collaborators } = useCollaborators();

  useEffect(() => {
    const loadTransfers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('transfers')
          .select('id, date, time, origin, destination, price, collaborator, commission, payment_status')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        const processedTransfers = data.map((transfer: any) => ({
          id: transfer.id,
          date: transfer.date,
          time: transfer.time || '',
          origin: transfer.origin,
          destination: transfer.destination,
          price: Number(transfer.price),
          collaborator: transfer.collaborator || '',
          commission: Number(transfer.commission),
          paymentStatus: transfer.payment_status || 'pending',
          expenses: []
        }));
        
        setTransfers(processedTransfers);
        
        calculateCollaboratorStats(processedTransfers);
        
        generateMonthlyStats(processedTransfers);
      } catch (error: any) {
        console.error('Error loading transfers:', error);
        toast.error(`Error al cargar los transfers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransfers();
  }, [collaborators]);

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
    
    collaboratorsData.sort((a, b) => b.commissionTotal - a.commissionTotal);
    
    setCollaboratorStats(collaboratorsData);
  };

  const generateMonthlyStats = (loadedTransfers: Transfer[]) => {
    const monthlyData: Record<string, Record<string, MonthlyCollaboratorStats>> = {};
    
    loadedTransfers.forEach((transfer: Transfer) => {
      if (!transfer.collaborator || !transfer.date) return;
      
      const dateParts = transfer.date.split('-');
      if (dateParts.length < 2) return;
      
      const year = dateParts[0];
      const month = dateParts[1];
      const monthYear = `${year}-${month}`;
      
      const monthDisplay = new Date(`${year}-${month}-01`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      const capitalizedMonthDisplay = monthDisplay.charAt(0).toUpperCase() + monthDisplay.slice(1);
      
      const capitalizedCollaborator = transfer.collaborator.charAt(0).toUpperCase() + transfer.collaborator.slice(1);
      
      const commissionAmount = (transfer.price * transfer.commission) / 100;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {};
      }
      
      if (!monthlyData[monthYear][transfer.collaborator]) {
        monthlyData[monthYear][transfer.collaborator] = {
          month: capitalizedMonthDisplay,
          collaborator: capitalizedCollaborator,
          transferCount: 0,
          commissionTotal: 0
        };
      }
      
      monthlyData[monthYear][transfer.collaborator].transferCount += 1;
      monthlyData[monthYear][transfer.collaborator].commissionTotal += commissionAmount;
    });
    
    const monthlyStatsArray: MonthlyCollaboratorStats[] = [];
    Object.keys(monthlyData).forEach(monthYear => {
      Object.keys(monthlyData[monthYear]).forEach(collaborator => {
        monthlyStatsArray.push(monthlyData[monthYear][collaborator]);
      });
    });
    
    monthlyStatsArray.sort((a, b) => {
      if (a.month !== b.month) {
        return b.month.localeCompare(a.month);
      }
      return b.commissionTotal - a.commissionTotal;
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
            <div>
              <CollaboratorsOverview transfers={transfers} />
            </div>

            <CollaboratorStatsSection collaboratorStats={collaboratorStats} />

            <MonthlyStatsCard monthlyStats={monthlyStats} />
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
