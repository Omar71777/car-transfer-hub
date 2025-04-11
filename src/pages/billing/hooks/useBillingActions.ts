
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
  const [isCreating, setIsCreating] = useState(false);

  const handleAddBill = () => {
    setIsFormDialogOpen(true);
  };

  const handleViewBill = async (bill: Bill) => {
    try {
      // Fetch the complete bill with items
      const fullBill = await getBill(bill.id);
      if (fullBill) {
        console.log('Viewing bill with items:', fullBill.items);
        setViewBill(fullBill);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error viewing bill:', error);
      toast.error('Error al cargar la factura');
    }
  };

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

  const handleDeleteBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDeleteDialogOpen(true);
  };

  const handlePrintBill = async (bill: Bill) => {
    try {
      await printBill(bill.id);
    } catch (error) {
      console.error('Error printing bill:', error);
      toast.error('Error al imprimir la factura');
    }
  };

  const handleDownloadBill = async (bill: Bill) => {
    try {
      await exportBillCsv(bill.id);
    } catch (error) {
      console.error('Error downloading bill:', error);
      toast.error('Error al exportar la factura');
    }
  };

  const handleFormSubmit = async (values: CreateBillDto) => {
    if (isCreating) return; // Prevent multiple submissions
    
    setIsCreating(true);
    try {
      console.log('Creating bill with values:', values);
      const billId = await createBill(values);
      console.log('Bill creation result billId:', billId);
      
      // Always close the dialog and refresh the bills list
      setIsFormDialogOpen(false);
      fetchBills();
      setActiveTab('bills');
      
      if (billId) {
        toast.success('Factura creada con éxito');
      } else {
        toast.error('Hubo un problema al crear la factura. Se creó sin items.');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Error al crear la factura');
      // Still close the dialog even on error
      setIsFormDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (id: string, data: Partial<Bill>, addedTransferIds: string[] = [], removedTransferIds: string[] = []) => {
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

  const handleStatusChange = async (status: Bill['status']) => {
    if (!viewBill) return;

    try {
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
    } catch (error) {
      console.error('Error changing bill status:', error);
      toast.error('Error al cambiar el estado de la factura');
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
    handleStatusChange,
    isCreating
  };
}
