
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

  // Centralized dialog state management
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
    selectedBill,
    setSelectedBill,
    viewBill,
    setViewBill,
    isCreating,
    setIsCreating,
    isLoading,
    setIsLoading,
    resetDialogStates
  } = useBillingDialogState();

  // Create handlers - pass dialog state from central dialog state
  const {
    handleAddBill,
    handleFormSubmit
  } = useBillCreateHandler(
    createBill, 
    fetchBills, 
    setActiveTab, 
    setIsFormDialogOpen,
    isCreating,
    setIsCreating
  );

  // View handlers - pass dialog state from central dialog state
  const {
    handleViewBill,
    handlePrintBill,
    handleDownloadBill,
    handleStatusChange: baseHandleStatusChange
  } = useBillViewHandlers(
    getBill, 
    printBill, 
    exportBillCsv
  );

  // Set up synchronized bill viewing
  const handleSynchronizedViewBill = async (bill: Bill) => {
    setIsLoading(true);
    try {
      await handleViewBill(bill);
      setViewBill(bill);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Error viewing bill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit handlers - pass dialog state from central dialog state
  const {
    handleEditBill: baseHandleEditBill,
    handleEditSubmit: baseHandleEditSubmit
  } = useBillEditHandlers(
    getBill, 
    updateBill, 
    updateBillTransfers, 
    fetchBills
  );

  // Set up synchronized bill editing
  const handleSynchronizedEditBill = async (bill: Bill) => {
    setIsLoading(true);
    try {
      const fullBill = await getBill(bill.id);
      if (fullBill) {
        setSelectedBill(fullBill);
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      console.error('Error editing bill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete handlers - pass dialog state from central dialog state
  const {
    handleDeleteBill,
    handleConfirmDelete
  } = useBillDeleteHandler(
    deleteBill, 
    fetchBills,
    setIsDeleteDialogOpen,
    setSelectedBill
  );

  // Wrapper handlers that integrate the specialized hooks with centralized state
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
    setIsEditDialogOpen(false);
    await fetchBills();
  };

  return {
    // State
    bills,
    loading: loading || isLoading,
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
    resetDialogStates,
    
    // Handlers
    handleAddBill,
    handleViewBill: handleSynchronizedViewBill,
    handleEditBill: handleSynchronizedEditBill,
    handleDeleteBill,
    handlePrintBill,
    handleDownloadBill,
    handleFormSubmit,
    handleEditSubmit: wrappedHandleEditSubmit,
    handleConfirmDelete,
    handleStatusChange: wrappedHandleStatusChange
  };
}
