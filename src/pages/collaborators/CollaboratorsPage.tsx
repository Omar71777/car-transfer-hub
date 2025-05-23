
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CollaboratorsOverview } from '@/components/collaborators/CollaboratorsOverview';
import { CollaboratorManagement } from '@/components/collaborators/CollaboratorManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transfer, ExtraCharge } from '@/types';
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
        // Fetch all transfers with collaborators
        const {
          data: transfersData,
          error: transfersError
        } = await supabase
          .from('transfers')
          .select(`
            id, 
            date, 
            time, 
            origin, 
            destination, 
            price, 
            collaborator, 
            commission, 
            commission_type,
            payment_status, 
            service_type, 
            client_id,
            discount_type,
            discount_value,
            hours
          `)
          .order('date', { ascending: false });
          
        if (transfersError) throw transfersError;

        // Fetch all extra charges
        const { data: extraChargesData, error: extraChargesError } = await supabase
          .from('extra_charges')
          .select('*');
          
        if (extraChargesError) throw extraChargesError;
        
        // Group extra charges by transfer ID
        const extraChargesByTransferId: Record<string, any[]> = {};
        extraChargesData.forEach((charge: any) => {
          if (!extraChargesByTransferId[charge.transfer_id]) {
            extraChargesByTransferId[charge.transfer_id] = [];
          }
          extraChargesByTransferId[charge.transfer_id].push(charge);
        });

        // Transform data to match our Transfer type
        const processedTransfers: Transfer[] = transfersData.map((transfer: any) => {
          // Map extra charges for this transfer with proper ExtraCharge structure
          const transferExtraCharges = extraChargesByTransferId[transfer.id] || [];
          const mappedExtraCharges: ExtraCharge[] = transferExtraCharges.map((charge: any) => ({
            id: charge.id,
            transferId: charge.transfer_id,
            name: charge.name || '',
            price: Number(charge.price)
          }));
          
          return {
            id: transfer.id,
            date: transfer.date,
            time: transfer.time || '',
            origin: transfer.origin,
            destination: transfer.destination,
            price: Number(transfer.price),
            collaborator: transfer.collaborator || '',
            commission: Number(transfer.commission),
            commissionType: transfer.commission_type || 'percentage', 
            paymentStatus: transfer.payment_status || 'pending',
            clientId: transfer.client_id || '',
            serviceType: transfer.service_type || 'transfer',
            expenses: [],
            discountType: transfer.discount_type,
            discountValue: Number(transfer.discount_value) || 0,
            hours: transfer.hours,
            extraCharges: mappedExtraCharges
          };
        });
        
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
  
  return <MainLayout>
      <div className="py-0 px-[3px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Colaboradores</h1>
          <p className="text-muted-foreground">Gestiona tus colaboradores y su rendimiento</p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6 px-[3px]">
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
    </MainLayout>;
};

export default CollaboratorsPage;
