
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransferForm } from '@/components/transfers/TransferForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';
import { PaymentStatusDialog } from '@/components/transfers/PaymentStatusDialog';
import { useCollaborators } from '@/hooks/useCollaborators';

const NewTransferPage = () => {
  const navigate = useNavigate();
  const { createTransfer } = useTransfers();
  const { collaborators } = useCollaborators();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [pendingTransferData, setPendingTransferData] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    // Store transfer data temporarily and open payment status dialog
    setPendingTransferData(values);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentStatusSubmit = async (paymentData: any) => {
    if (!pendingTransferData) return;
    
    // Merge transfer data with payment status data
    const transferData = {
      ...pendingTransferData,
      paymentStatus: paymentData.paymentStatus,
      paymentCollaborator: paymentData.paymentStatus === 'a_cobrar' ? paymentData.paymentCollaborator : null
    };
    
    const transferId = await createTransfer(transferData);
    
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
        
        <PaymentStatusDialog 
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          onSubmit={handlePaymentStatusSubmit}
          collaborators={collaborators}
        />
      </div>
    </MainLayout>
  );
};

export default NewTransferPage;
