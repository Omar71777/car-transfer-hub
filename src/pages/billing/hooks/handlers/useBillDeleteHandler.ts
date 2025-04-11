
import { useState } from 'react';
import { Bill } from '@/types/billing';
import { toast } from 'sonner';

export function useBillDeleteHandler(
  deleteBill: (id: string) => Promise<boolean>,
  fetchBills: () => Promise<void>
) {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBill) return;

    try {
      const success = await deleteBill(selectedBill.id);
      if (success) {
        toast.success('Factura eliminada con éxito');
        setIsDeleteDialogOpen(false);
        fetchBills();
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Error al eliminar la factura');
      // Close dialog even on error
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    selectedBill,
    setSelectedBill,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteBill,
    handleConfirmDelete
  };
}
