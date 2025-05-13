
import { useCallback, useState } from 'react';
import { Transfer } from '@/types';
import { toast } from 'sonner';

export function useTransferOperations(
  fetchTransfers: () => Promise<void>,
  updateTransfer: (id: string, data: Partial<Transfer>) => Promise<boolean>,
  deleteTransfer: (id: string) => Promise<boolean>,
  setIsEditDialogOpen: (isOpen: boolean) => void
) {
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  
  const handleEditSubmit = useCallback(async (values: any) => {
    try {
      console.log('Submitting edited transfer:', values);
      
      // Process form values for submission
      const processedValues = {
        ...values,
        price: Number(values.price),
        commission: values.commission ? Number(values.commission) : 0,
        discountValue: values.discountValue ? Number(values.discountValue) : 0,
        extraCharges: (values.extraCharges || [])
          .filter((charge: any) => charge && charge.name && charge.price)
          .map((charge: any) => ({
            id: charge.id,
            name: charge.name,
            price: typeof charge.price === 'string' ? Number(charge.price) : charge.price
          })),
        hours: values.hours ? Number(values.hours) : undefined
      };
      
      const success = await updateTransfer(values.id, processedValues);
      if (success) {
        toast.success('Transfer actualizado correctamente');
        setIsEditDialogOpen(false);
        await fetchTransfers();
        return true;
      } else {
        toast.error('Error al actualizar el transfer');
        return false;
      }
    } catch (error: any) {
      toast.error(`Error al actualizar el transfer: ${error.message}`);
      return false;
    }
  }, [updateTransfer, setIsEditDialogOpen, fetchTransfers]);
  
  const handleDeleteTransfer = useCallback(async (id: string) => {
    try {
      const success = await deleteTransfer(id);
      if (success) {
        toast.success('Transfer eliminado correctamente');
        await fetchTransfers();
        return true;
      } else {
        toast.error('Error al eliminar el transfer');
        return false;
      }
    } catch (error: any) {
      toast.error(`Error al eliminar el transfer: ${error.message}`);
      return false;
    }
  }, [deleteTransfer, fetchTransfers]);
  
  const handleDeleteMultipleTransfers = useCallback(async (ids: string[]) => {
    try {
      let successCount = 0;
      for (const id of ids) {
        const success = await deleteTransfer(id);
        if (success) {
          successCount++;
        }
      }
      
      if (successCount === ids.length) {
        toast.success(`${ids.length} transfers eliminados correctamente`);
      } else if (successCount > 0) {
        toast.info(`${successCount} de ${ids.length} transfers eliminados correctamente`);
      } else {
        toast.error('No se pudo eliminar ningún transfer');
      }
      
      await fetchTransfers();
      return successCount > 0;
    } catch (error: any) {
      toast.error(`Error al eliminar transfers: ${error.message}`);
      return false;
    }
  }, [deleteTransfer, fetchTransfers]);

  const handleMarkAsPaid = useCallback(async (transferId: string, newStatus?: 'paid' | 'pending') => {
    try {
      // If newStatus is not provided, toggle from pending to paid
      const status = newStatus || 'paid';
      const success = await updateTransfer(transferId, { paymentStatus: status });
      
      if (success) {
        toast.success(
          status === 'paid' 
            ? 'Transfer marcado como cobrado' 
            : 'Transfer marcado como pendiente'
        );
        await fetchTransfers();
        return true;
      } else {
        toast.error('Error al actualizar el estado de pago');
        return false;
      }
    } catch (error: any) {
      toast.error(`Error al actualizar el estado de pago: ${error.message}`);
      return false;
    }
  }, [updateTransfer, fetchTransfers]);
  
  return {
    editingTransfer,
    setEditingTransfer,
    handleEditSubmit,
    handleDeleteTransfer,
    handleDeleteMultipleTransfers,
    handleMarkAsPaid
  };
}
