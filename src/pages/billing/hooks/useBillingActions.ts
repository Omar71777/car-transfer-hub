
import { useBillingDialogState } from './state/useBillingDialogState';
import { useBillViewHandlers } from './handlers/useBillViewHandlers';
import { useBillEditHandlers } from './handlers/useBillEditHandlers';
import { useBillDeleteHandler } from './handlers/useBillDeleteHandler';
import { useBillCreateHandler } from './handlers/useBillCreateHandler';
import { Bill, CreateBillDto } from '@/types/billing';
import { useBilling } from '@/hooks/useBilling';

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

  // Dialog state management
  const {
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
    selectedBill: dialogSelectedBill,
    setSelectedBill: setDialogSelectedBill,
    viewBill: dialogViewBill,
    setViewBill: setDialogViewBill,
    isCreating: dialogIsCreating,
    setIsCreating: setDialogIsCreating
  } = useBillingDialogState();

  // Create handlers
  const {
    isCreating,
    handleAddBill,
    handleFormSubmit
  } = useBillCreateHandler(createBill, fetchBills, setActiveTab, setIsFormDialogOpen);

  // View handlers
  const {
    viewBill,
    setViewBill,
    handleViewBill,
    handlePrintBill,
    handleDownloadBill,
    handleStatusChange: baseHandleStatusChange
  } = useBillViewHandlers(getBill, printBill, exportBillCsv);

  // Edit handlers
  const {
    selectedBill,
    setSelectedBill,
    handleEditBill,
    handleEditSubmit: baseHandleEditSubmit
  } = useBillEditHandlers(getBill, updateBill, updateBillTransfers, fetchBills);

  // Delete handlers
  const {
    handleDeleteBill,
    handleConfirmDelete
  } = useBillDeleteHandler(deleteBill, fetchBills);

  // Wrapper handlers that integrate the specialized hooks
  const wrappedHandleStatusChange = async (status: Bill['status']) => {
    await baseHandleStatusChange(status, viewBill, updateBillStatus, getBill, fetchBills);
  };

  const wrappedHandleEditSubmit = async (
    id: string,
    data: Partial<Bill>,
    addedTransferIds: string[] = [],
    removedTransferIds: string[] = []
  ) => {
    await baseHandleEditSubmit(id, data, addedTransferIds, removedTransferIds, viewBill, setViewBill);
  };

  return {
    // State
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
    isCreating,
    
    // Operations
    fetchBills,
    
    // Handlers
    handleAddBill,
    handleViewBill,
    handleEditBill,
    handleDeleteBill,
    handlePrintBill,
    handleDownloadBill,
    handleFormSubmit,
    handleEditSubmit: wrappedHandleEditSubmit,
    handleConfirmDelete,
    handleStatusChange: wrappedHandleStatusChange
  };
}
