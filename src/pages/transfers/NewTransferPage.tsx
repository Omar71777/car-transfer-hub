
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';
import { useClients } from '@/hooks/useClients';
import { ConversationalTransferForm } from '@/components/transfers/ConversationalTransferForm';

const NewTransferPage = () => {
  const navigate = useNavigate();
  const { createTransfer } = useTransfers();
  const { clients, createClient } = useClients();

  const handleSubmit = async (values: any) => {
    // Check if we need to create a new client
    if (values.clientId === 'new' && values.clientName) {
      // Create new client with just the name
      // Generate a temporary email if needed
      const clientEmail = values.clientEmail || `${values.clientName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
      
      const clientId = await createClient({
        name: values.clientName,
        email: clientEmail,
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
    
    // Process commission value
    if (values.commission === '' || values.commission === undefined) {
      values.commission = 0;
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
          <p className="text-muted-foreground text-left text-sm md:text-base">Completa el formulario paso a paso para registrar un nuevo servicio</p>
        </div>
        
        <ConversationalTransferForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
};

export default NewTransferPage;
