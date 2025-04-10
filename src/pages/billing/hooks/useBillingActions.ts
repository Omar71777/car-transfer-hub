
import { useState } from 'react';
import { Bill, CreateBillDto } from '@/types/billing';
import { useBilling } from '@/hooks/useBilling';
import { toast } from 'sonner';

export function useBillingActions() {
  const { 
    bills, 
    loading, 
    fetchBills, 
    createBill, 
    getBill, 
    updateBill, 
    updateBillStatus, 
    deleteBill, 
    printBill,
    exportBillCsv,
    updateBillTransfers
  } = useBilling();

  const [activeTab, setActiveTab] = useState('bills');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  const handleAddBill = () => {
    setIsFormDialogOpen(true);
  };

  const handleViewBill = async (bill: Bill) => {
    // Fetch the complete bill with items
    const fullBill = await getBill(bill.id);
    if (fullBill) {
      setViewBill(fullBill);
      setIsViewDialogOpen(true);
    }
  };

  const handleEditBill = async (bill: Bill) => {
    const fullBill = await getBill(bill.id);
    if (fullBill) {
      setSelectedBill(fullBill);
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDeleteDialogOpen(true);
  };

  const handlePrintBill = async (bill: Bill) => {
    await printBill(bill.id);
  };

  const handleDownloadBill = async (bill: Bill) => {
    await exportBillCsv(bill.id);
  };

  const handleFormSubmit = async (values: CreateBillDto) => {
    const billId = await createBill(values);
    if (billId) {
      toast.success('Factura creada con éxito');
      setIsFormDialogOpen(false);
      fetchBills();
      setActiveTab('bills');
    }
  };

  const handleEditSubmit = async (id: string, data: Partial<Bill>, addedTransferIds: string[] = [], removedTransferIds: string[] = []) => {
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
  };

  const handleConfirmDelete = async () => {
    if (!selectedBill) return;

    const success = await deleteBill(selectedBill.id);
    if (success) {
      toast.success('Factura eliminada con éxito');
      setIsDeleteDialogOpen(false);
      fetchBills();
    }
  };

  const handleStatusChange = async (status: Bill['status']) => {
    if (!viewBill) return;

    const success = await updateBillStatus(viewBill.id, status);
    if (success) {
      const statusMessages = {
        draft: 'borrador',
        sent: 'enviada',
        paid: 'pagada',
        cancelled: 'cancelada'
      };
      
      toast.success(`Factura marcada como ${statusMessages[status]}`);
      
      // Actualizar la factura en la vista
      const updatedBill = await getBill(viewBill.id);
      if (updatedBill) {
        setViewBill(updatedBill);
      }
      
      fetchBills();
    }
  };

  return {
    bills,
    loading,
    activeTab,
    setActiveTab,
    isFormDialogOpen,
    setIsFormDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedBill,
    viewBill,
    fetchBills,
    handleAddBill,
    handleViewBill,
    handleEditBill,
    handleDeleteBill,
    handlePrintBill,
    handleDownloadBill,
    handleFormSubmit,
    handleEditSubmit,
    handleConfirmDelete,
    handleStatusChange
  };
}
