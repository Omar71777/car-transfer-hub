
import { useState } from 'react';
import { Bill } from '@/types/billing';
import { toast } from 'sonner';

export function useBillEditHandlers(
  getBill: (id: string) => Promise<Bill | null>,
  updateBill: (id: string, data: Partial<Bill>) => Promise<boolean>,
  updateBillTransfers: (billId: string, addedTransferIds: string[], removedTransferIds: string[]) => Promise<boolean>,
  fetchBills: () => Promise<void>
) {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditBill = async (bill: Bill) => {
    try {
      const fullBill = await getBill(bill.id);
      if (fullBill) {
        setSelectedBill(fullBill);
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      console.error('Error editing bill:', error);
      toast.error('Error al cargar la factura para editar');
    }
  };

  const handleEditSubmit = async (
    id: string, 
    data: Partial<Bill>, 
    addedTransferIds: string[] = [], 
    removedTransferIds: string[] = [],
    viewBill: Bill | null,
    setViewBill: (bill: Bill | null) => void
  ) => {
    try {
      // If there are transfers to add or remove, update them first
      if (addedTransferIds.length > 0 || removedTransferIds.length > 0) {
        const transfersUpdated = await updateBillTransfers(id, addedTransferIds, removedTransferIds);
        if (!transfersUpdated) {
          return;
        }
      }
      
      // Then update the bill data
      const success = await updateBill(id, data);
      if (success) {
        toast.success('Factura actualizada con éxito');
        setIsEditDialogOpen(false);
        fetchBills();
        
        // Si la factura está siendo visualizada, actualizar la vista
        if (viewBill && viewBill.id === id) {
          const updatedBill = await getBill(id);
          if (updatedBill) {
            setViewBill(updatedBill);
          }
        }
      }
    } catch (error) {
      console.error('Error updating bill:', error);
      toast.error('Error al actualizar la factura');
      // Close dialog even on error
      setIsEditDialogOpen(false);
    }
  };

  return {
    selectedBill,
    setSelectedBill,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEditBill,
    handleEditSubmit
  };
}
