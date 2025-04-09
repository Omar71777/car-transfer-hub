
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransferForm } from '@/components/transfers/TransferForm';
import { generateId } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Transfer } from '@/types';

const NewTransferPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    // Crear el nuevo transfer
    const newTransfer: Transfer = {
      id: generateId(),
      ...values,
      expenses: []
    };
    
    // Obtener transfers existentes del localStorage
    const existingTransfers = localStorage.getItem('transfers');
    const transfers = existingTransfers ? JSON.parse(existingTransfers) : [];
    
    // Agregar el nuevo transfer y guardar en localStorage
    transfers.push(newTransfer);
    localStorage.setItem('transfers', JSON.stringify(transfers));
    
    // Mostrar notificación y redireccionar
    toast.success('Transfer creado exitosamente');
    navigate('/transfers');
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-ibiza-900">Nuevo Transfer</h1>
          <p className="text-muted-foreground">Completa el formulario para registrar un nuevo servicio</p>
        </div>
        
        <TransferForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
};

export default NewTransferPage;
