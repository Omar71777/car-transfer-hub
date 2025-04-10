
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransferForm } from '@/components/transfers/TransferForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';

const NewTransferPage = () => {
  const navigate = useNavigate();
  const { createTransfer } = useTransfers();

  const handleSubmit = async (values: any) => {
    const transferId = await createTransfer(values);
    
    if (transferId) {
      toast.success('Transfer creado exitosamente');
      navigate('/transfers');
    }
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
