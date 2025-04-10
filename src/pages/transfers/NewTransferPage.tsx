
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransferForm } from '@/components/transfers/TransferForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';
import { useClients } from '@/hooks/useClients';

const NewTransferPage = () => {
  const navigate = useNavigate();
  const { createTransfer } = useTransfers();
  const { clients, createClient } = useClients();

  const handleSubmit = async (values: any) => {
    // Check if we need to create a new client
    if (values.clientId === 'new' && values.clientName && values.clientEmail) {
      // Create new client
      const clientId = await createClient({
        name: values.clientName,
        email: values.clientEmail,
      });
      
      if (clientId) {
        // Update the clientId with the newly created client ID
        values.clientId = clientId;
        toast.success('Cliente creado exitosamente');
      } else {
        toast.error('No se pudo crear el cliente');
        return;
      }
    }
    
    const transferId = await createTransfer(values);
    
    if (transferId) {
      toast.success('Transfer creado exitosamente');
      navigate('/transfers');
    }
  };

  return (
    <MainLayout>
      <div className="py-4 md:py-6 px-2 md:px-0">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-ibiza-900 text-left">Nuevo Transfer</h1>
          <p className="text-muted-foreground text-left text-sm md:text-base">Completa el formulario para registrar un nuevo servicio</p>
        </div>
        
        <TransferForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
};

export default NewTransferPage;
