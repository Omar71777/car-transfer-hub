
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';
import { useClients } from '@/hooks/useClients';
import { ConversationalTransferForm } from '@/components/transfers/ConversationalTransferForm';
import { useAuth } from '@/contexts/auth';
import { CreateClientDto } from '@/types/client';

const NewTransferPage = () => {
  const navigate = useNavigate();
  const { createTransfer } = useTransfers();
  const { clients, createClient } = useClients();
  const { user } = useAuth();
  const [newClientId, setNewClientId] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('NewTransferPage mounted, user authentication state:', !!user);
    
    if (!user) {
      console.warn('No authenticated user detected');
      toast.warning('Debe iniciar sesión para crear un transfer');
      // Note: You might want to add navigation to login page here
      // but keeping this as is for now to avoid breaking current flow
    }
  }, [user]);

  const handleSubmit = async (values: any) => {
    console.log('New transfer form submitted with values:', values);
    
    if (!user) {
      console.error('No authenticated user found during submission');
      toast.error('Debe iniciar sesión para crear un transfer');
      return;
    }
    
    try {
      // Check if we need to create a new client
      if (values.clientId === 'new' && values.clientName) {
        // Create new client with just the name
        // Generate a temporary email if needed
        const clientEmail = values.clientEmail || `${values.clientName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
        
        console.log('Creating new client:', { name: values.clientName, email: clientEmail });
        
        // Create client data that conforms to CreateClientDto
        const newClientData: CreateClientDto = {
          name: values.clientName,
          email: clientEmail,
        };
        
        const newClient = await createClient(newClientData);
        
        if (newClient) {
          // Update the clientId with the newly created client ID
          values.clientId = newClient.id;
          // Store the new client ID to update the form
          setNewClientId(newClient.id);
          console.log('Client created successfully with ID:', newClient.id);
          toast.success('Cliente creado exitosamente');
        } else {
          console.error('Failed to create client');
          toast.error('No se pudo crear el cliente');
          return;
        }
      }
      
      // Process commission value
      if (values.commission === '' || values.commission === undefined) {
        values.commission = 0;
      }

      // Process discount value
      if (!values.discountType || values.discountValue === '' || values.discountValue === undefined) {
        values.discountType = null;
        values.discountValue = 0;
      }
      
      // Make sure extra charges is an array
      if (!Array.isArray(values.extraCharges)) {
        values.extraCharges = [];
      }
      
      // Filter out invalid extra charges
      values.extraCharges = values.extraCharges.filter((charge: any) => 
        charge && charge.name && charge.price && charge.name.trim() !== ''
      );
      
      // Set defaults for conditional fields
      if (values.serviceType === 'dispo') {
        if (!values.destination || values.destination.trim() === '') {
          values.destination = 'N/A';
        }
        
        // Make sure hours is a number
        if (values.hours && typeof values.hours === 'string') {
          values.hours = values.hours.trim();
        }
      } else if (values.serviceType === 'transfer') {
        // For transfers, hours is optional
        if (!values.hours || values.hours.trim() === '') {
          values.hours = null;
        }
      }
      
      console.log('Creating transfer with processed values:', values);
      const transferId = await createTransfer(values);
      
      if (transferId) {
        console.log('Transfer created successfully with ID:', transferId);
        toast.success('Transfer creado exitosamente');
        navigate('/transfers');
      } else {
        console.error('Failed to create transfer - no ID returned');
        toast.error('Error al crear el transfer');
      }
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast.error(`Error al procesar el formulario: ${error.message || 'Error desconocido'}`);
    }
  };

  return (
    <MainLayout>
      <div className="py-4 md:py-6 px-2 md:px-0">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-ibiza-900 text-left">Nuevo Transfer</h1>
          <p className="text-muted-foreground text-left text-sm md:text-base">Completa el formulario paso a paso para registrar un nuevo servicio</p>
        </div>
        
        <ConversationalTransferForm 
          onSubmit={handleSubmit} 
          initialClientId={newClientId}
        />
      </div>
    </MainLayout>
  );
};

export default NewTransferPage;
