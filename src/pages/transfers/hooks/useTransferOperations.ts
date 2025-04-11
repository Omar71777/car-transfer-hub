
import { useState } from 'react';
import { toast } from 'sonner';
import { Transfer } from '@/types';

export function useTransferOperations(
  fetchTransfers: () => Promise<void>,
  updateTransfer: (id: string, data: any) => Promise<boolean>,
  deleteTransfer: (id: string) => Promise<boolean>,
  setIsEditDialogOpen: (open: boolean) => void
) {
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);

  const handleEditSubmit = async (values: any) => {
    if (!editingTransfer) return;
    
    // Convert string values to numbers for the API call
    const processedValues = {
      ...values,
      price: Number(values.price),
      commission: values.commission && values.commission !== '' ? Number(values.commission) : undefined,
    };
    
    const success = await updateTransfer(editingTransfer.id, processedValues);
    if (success) {
      setIsEditDialogOpen(false);
      toast.success("Transfer actualizado");
      fetchTransfers();
    }
  };
  
  const handleDeleteTransfer = async (id: string) => {
    const success = await deleteTransfer(id);
    if (success) {
      toast.success("Transfer eliminado");
      fetchTransfers();
    }
  };
  
  const handleDeleteMultipleTransfers = async (ids: string[]) => {
    let successCount = 0;
    
    for (const id of ids) {
      const success = await deleteTransfer(id);
      if (success) successCount++;
    }
    
    if (successCount === ids.length) {
      toast.success(`${successCount} transfers eliminados correctamente`);
    } else if (successCount > 0) {
      toast.warning(`${successCount} de ${ids.length} transfers eliminados. Algunos no pudieron ser eliminados.`);
    } else {
      toast.error("No se pudo eliminar ningún transfer");
    }
    
    fetchTransfers();
  };

  return {
    editingTransfer,
    setEditingTransfer,
    handleEditSubmit,
    handleDeleteTransfer,
    handleDeleteMultipleTransfers
  };
}
