
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
