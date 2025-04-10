import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CollaboratorManagement } from '@/components/collaborators/CollaboratorManagement';
import { CollaboratorsOverview } from '@/components/collaborators/CollaboratorsOverview';
import { supabase } from '@/integrations/supabase/client';
import { Transfer } from '@/types';
import { toast } from 'sonner';

const CollaboratorsPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransfers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
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
            payment_status,
            payment_collaborator,
            expenses (
              id,
              date,
              concept,
              amount
            )
          `)
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match our Transfer type
        const transformedData = data.map((transfer: any) => ({
          id: transfer.id,
          date: transfer.date,
          time: transfer.time || '',
          origin: transfer.origin,
          destination: transfer.destination,
          price: Number(transfer.price),
          collaborator: transfer.collaborator || '',
          commission: Number(transfer.commission),
          paymentStatus: transfer.payment_status || 'cobrado',
          paymentCollaborator: transfer.payment_collaborator || '',
          expenses: transfer.expenses.map((expense: any) => ({
            id: expense.id,
            transferId: transfer.id,
            date: expense.date,
            concept: expense.concept,
            amount: Number(expense.amount)
          }))
        }));

        setTransfers(transformedData);
      } catch (error: any) {
        console.error('Error fetching transfers:', error);
        toast.error(`Error al cargar los transfers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTransfers();
  }, []);

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-ibiza-900">Collaborators</h1>
          <p className="text-muted-foreground">Gestiona tus colaboradores y sus comisiones</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CollaboratorManagement />
          <CollaboratorsOverview transfers={transfers} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
};

export default CollaboratorsPage;
