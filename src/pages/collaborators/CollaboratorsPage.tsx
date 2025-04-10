
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CollaboratorsOverview } from '@/components/collaborators/CollaboratorsOverview';
import { CollaboratorManagement } from '@/components/collaborators/CollaboratorManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transfer } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { CollaboratorStatsSection } from '@/components/collaborators/CollaboratorStatsSection';
import { toast } from 'sonner';

const CollaboratorsPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch transfers to calculate collaborator stats
  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('transfers')
          .select('id, date, time, origin, destination, price, collaborator, commission, payment_status')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // Transform data to match our Transfer type
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
        
      } catch (error: any) {
        console.error('Error fetching transfers:', error);
        toast.error(`Error al cargar los transfers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransfers();
  }, []);
  
  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Colaboradores</h1>
          <p className="text-muted-foreground">Gestiona tus colaboradores y su rendimiento</p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="management">Gestión</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <CollaboratorsOverview transfers={transfers} loading={loading} />
          </TabsContent>
          
          <TabsContent value="management">
            <CollaboratorManagement />
          </TabsContent>
          
          <TabsContent value="stats">
            <CollaboratorStatsSection transfers={transfers} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CollaboratorsPage;
