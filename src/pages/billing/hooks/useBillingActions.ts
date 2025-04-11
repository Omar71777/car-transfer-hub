
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

  // Get handlers but don't use their internal state
  const {
    handleViewBill: baseHandleViewBill,
    handlePrintBill,
    handleDownloadBill,
    handleStatusChange: baseHandleStatusChange
  } = useBillViewHandlers(
    getBill, 
    printBill, 
    exportBillCsv
  );

  const {
    handleEditBill: baseHandleEditBill,
    handleEditSubmit: baseHandleEditSubmit
  } = useBillEditHandlers(
    getBill, 
    updateBill, 
    updateBillTransfers, 
    fetchBills
  );

  const {
    handleDeleteBill: baseHandleDeleteBill,
    handleConfirmDelete: baseHandleConfirmDelete
  } = useBillDeleteHandler(
    deleteBill, 
    fetchBills
  );

  const {
    handleAddBill,
    handleFormSubmit: baseHandleFormSubmit
  } = useBillCreateHandler(
    createBill, 
    fetchBills, 
    setActiveTab, 
    setIsFormDialogOpen,
    setIsCreating
  );

  // Integrated handlers that work with the central state
  const handleViewBill = async (bill: Bill) => {
    // Close any open dialogs first
    resetDialogStates();
    
    // Now open the requested dialog
    await baseHandleViewBill(
      bill,
      setViewBill,
      setIsViewDialogOpen,
      setIsLoading
    );
  };

  const handleEditBill = async (bill: Bill) => {
    // Close any open dialogs first
    resetDialogStates();
    
    // Now open the requested dialog
    await baseHandleEditBill(
      bill,
      setSelectedBill,
      setIsEditDialogOpen,
      setIsLoading
    );
  };

  const handleDeleteBill = (bill: Bill) => {
    // Close any open dialogs first
    resetDialogStates();
    
    // Now open the requested dialog
    baseHandleDeleteBill(
      bill,
      setSelectedBill,
      setIsDeleteDialogOpen
    );
  };

  const handleFormSubmit = async (values: CreateBillDto) => {
    await baseHandleFormSubmit(values);
  };

  const handleEditSubmit = async (
    id: string,
    data: Partial<Bill>,
    addedTransferIds: string[] = [],
    removedTransferIds: string[] = []
  ) => {
    await baseHandleEditSubmit(
      id, 
      data, 
      addedTransferIds, 
      removedTransferIds, 
      viewBill, 
      setViewBill,
      setIsEditDialogOpen
    );
  };

  const handleConfirmDelete = async () => {
    await baseHandleConfirmDelete(
      selectedBill,
      setIsDeleteDialogOpen,
      setSelectedBill
    );
  };

  const handleStatusChange = async (status: Bill['status']) => {
    await baseHandleStatusChange(
      status, 
      viewBill, 
      updateBillStatus, 
      getBill, 
      setViewBill, 
      fetchBills
    );
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
