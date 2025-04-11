
import { useState } from 'react';
import { Bill } from '@/types/billing';
import { toast } from 'sonner';

export function useBillDeleteHandler(
  deleteBill: (id: string) => Promise<boolean>,
  fetchBills: () => Promise<void>,
  setIsDeleteDialogOpen?: (isOpen: boolean) => void,
  setSelectedBill?: (bill: Bill | null) => void
) {
  // Use provided state setters or create local ones if not provided
  const [localSelectedBill, localSetSelectedBill] = useState<Bill | null>(null);
  const [localIsDeleteDialogOpen, localSetIsDeleteDialogOpen] = useState(false);
  
  // Use external state handlers if provided, otherwise use local state
  const effectiveSetSelectedBill = setSelectedBill || localSetSelectedBill;
  const effectiveSetIsDeleteDialogOpen = setIsDeleteDialogOpen || localSetIsDeleteDialogOpen;
  
  // Use external selected bill if provided, otherwise use local state
  const selectedBill = setSelectedBill ? undefined : localSelectedBill;
  const isDeleteDialogOpen = setIsDeleteDialogOpen ? undefined : localIsDeleteDialogOpen;

  const handleDeleteBill = (bill: Bill) => {
    effectiveSetSelectedBill(bill);
    effectiveSetIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Get the bill from props or local state
    const billToDelete = setSelectedBill ? undefined : localSelectedBill;
    
    if (!billToDelete && !selectedBill) {
      console.error('No bill selected for deletion');
      toast.error('Error: No bill selected for deletion');
      return;
    }

    const billId = billToDelete?.id || selectedBill?.id;
    if (!billId) return;

    try {
      const success = await deleteBill(billId);
      if (success) {
        toast.success('Factura eliminada con éxito');
        effectiveSetIsDeleteDialogOpen(false);
        effectiveSetSelectedBill(null);
        await fetchBills();
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Error al eliminar la factura');
      // Close dialog even on error
      effectiveSetIsDeleteDialogOpen(false);
      effectiveSetSelectedBill(null);
    }
  };

  return {
    selectedBill,
    setSelectedBill: effectiveSetSelectedBill,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen: effectiveSetIsDeleteDialogOpen,
    handleDeleteBill,
    handleConfirmDelete
  };
}
