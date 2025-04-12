
import { useState } from 'react';
import { toast } from 'sonner';
import { Transfer } from '@/types';

export function useTransferOperations(
  fetchTransfers: () => void,
  updateTransfer: (id: string, data: Partial<Transfer>) => Promise<any>,
  deleteTransfer: (id: string) => Promise<any>,
  setIsEditDialogOpen: (isOpen: boolean) => void
) {
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);

  const handleEditSubmit = async (data: any) => {
    if (!editingTransfer) return;
    
    try {
      await updateTransfer(editingTransfer.id, data);
      toast.success('Traslado actualizado correctamente');
      setIsEditDialogOpen(false);
      fetchTransfers();
    } catch (error) {
      console.error('Error updating transfer:', error);
      toast.error('Error al actualizar el traslado');
    }
  };

  const handleDeleteTransfer = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este traslado?')) {
      try {
        await deleteTransfer(id);
        toast.success('Traslado eliminado correctamente');
        fetchTransfers();
      } catch (error) {
        console.error('Error deleting transfer:', error);
        toast.error('Error al eliminar el traslado');
      }
    }
  };

  const handleDeleteMultipleTransfers = async (ids: string[]) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${ids.length} traslados?`)) {
      try {
        // Delete each transfer in sequence
        for (const id of ids) {
          await deleteTransfer(id);
        }
        toast.success(`${ids.length} traslados eliminados correctamente`);
        fetchTransfers();
      } catch (error) {
        console.error('Error deleting multiple transfers:', error);
        toast.error('Error al eliminar los traslados');
      }
    }
  };

  const handleMarkAsPaid = async (transferId: string, newStatus: 'paid' | 'pending' = 'paid') => {
    try {
      await updateTransfer(transferId, { paymentStatus: newStatus });
      
      const statusMessage = newStatus === 'paid' 
        ? 'Traslado marcado como cobrado' 
        : 'Traslado marcado como pendiente';
      
      toast.success(statusMessage);
      fetchTransfers();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Error al actualizar el estado de pago');
    }
  };

  return {
    editingTransfer,
    setEditingTransfer,
    handleEditSubmit,
    handleDeleteTransfer,
    handleDeleteMultipleTransfers,
    handleMarkAsPaid
  };
}
