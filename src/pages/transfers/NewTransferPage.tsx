
import React, { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';
import { useClients } from '@/hooks/useClients';
import { TransferForm } from '@/components/transfers/TransferForm';
import { useAuth } from '@/contexts/auth';
import { CreateClientDto } from '@/types/client';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { usePointerEventsCleanup } from './hooks/usePointerEventsCleanup';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQueryClient } from '@tanstack/react-query';

const NewTransferPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { createTransfer } = useTransfers();
  const { clients, fetchClients, createClient, loading: clientsLoading } = useClients();
  const { user } = useAuth();
  const [newClientId, setNewClientId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Apply pointer events cleanup
  usePointerEventsCleanup();
  
  const initializeData = useCallback(async () => {
    try {
      if (user) {
        console.log('NewTransferPage: initializing, fetching clients');
        setIsInitializing(true);
        await fetchClients();
        console.log('NewTransferPage: clients fetched successfully');
      } else {
        console.warn('No authenticated user detected');
        toast.warning('Debe iniciar sesión para crear un transfer');
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      toast.error('Error al cargar los datos iniciales');
    } finally {
      setIsInitializing(false);
    }
  }, [user, fetchClients]);
  
  useEffect(() => {
    console.log('NewTransferPage mounted, user authentication state:', !!user);
    initializeData();
  }, [user, initializeData]);

  const handleClientCreated = useCallback(async (): Promise<void> => {
    console.log('NewTransferPage: client created, refreshing client list');
    try {
      // Force a refresh of the clients query
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      await fetchClients();
      console.log('NewTransferPage: updated client list fetched');
    } catch (error) {
      console.error('Error refreshing client list:', error);
      toast.error('Error al actualizar la lista de clientes');
    }
  }, [fetchClients, queryClient]);

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
      
      // Make sure extra charges is an array and properly formatted
      const extraCharges = (values.extraCharges || []).filter((charge: any) => 
        charge && charge.name && charge.price && charge.name.trim() !== ''
      ).map((charge: any) => ({
        name: charge.name,
        price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
      }));
      
      // Update the values with the formatted extra charges
      values.extraCharges = extraCharges;
      
      console.log('Processing extra charges:', extraCharges.length, 'charges found');
      
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
      
      // Ensure payment method is set when paid
      if (values.paymentStatus === 'paid' && !values.payment_method) {
        values.payment_method = 'cash'; // Default to cash if not specified
      } else if (values.paymentStatus === 'pending') {
        values.payment_method = null;
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
      <MobileHeader title="Nuevo Transfer" backButton={true} />
      
      <div className="py-4 px-0">
        <div className="mb-3">
          <p className="text-muted-foreground text-sm">Complete el formulario para registrar un nuevo servicio de transfer o disposición</p>
        </div>
        
        {isInitializing ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
            <p className="text-muted-foreground ml-2">Cargando datos...</p>
          </div>
        ) : (
          <TransferForm 
            onSubmit={handleSubmit} 
            newClientId={newClientId}
            onClientCreated={handleClientCreated}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default NewTransferPage;
