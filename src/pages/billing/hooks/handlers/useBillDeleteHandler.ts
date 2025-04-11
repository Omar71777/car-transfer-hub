
import { Bill } from '@/types/billing';
import { toast } from 'sonner';

export function useBillDeleteHandler(
  deleteBill: (id: string) => Promise<boolean>,
  fetchBills: () => Promise<void>
) {
  const handleDeleteBill = (
    bill: Bill,
    setSelectedBill: (bill: Bill | null) => void,
    setIsDeleteDialogOpen: (isOpen: boolean) => void
  ) => {
    setSelectedBill(bill);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (
    selectedBill: Bill | null,
    setIsDeleteDialogOpen: (isOpen: boolean) => void,
    setSelectedBill: (bill: Bill | null) => void
  ) => {
    if (!selectedBill) {
      console.error('No bill selected for deletion');
      toast.error('Error: No bill selected for deletion');
      return;
    }

    try {
      const success = await deleteBill(selectedBill.id);
      if (success) {
        toast.success('Factura eliminada con éxito');
        setIsDeleteDialogOpen(false);
        setSelectedBill(null);
        await fetchBills();
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Error al eliminar la factura');
      // Close dialog even on error
      setIsDeleteDialogOpen(false);
      setSelectedBill(null);
    }
  };

  return {
    handleDeleteBill,
    handleConfirmDelete
  };
}
