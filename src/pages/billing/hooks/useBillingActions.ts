
import { useBillingDialogState } from './state/useBillingDialogState';
import { useBillViewHandlers } from './handlers/useBillViewHandlers';
import { useBillEditHandlers } from './handlers/useBillEditHandlers';
import { useBillDeleteHandler } from './handlers/useBillDeleteHandler';
import { useBillCreateHandler } from './handlers/useBillCreateHandler';
import { Bill, CreateBillDto } from '@/types/billing';
import { useBilling } from '@/hooks/useBilling';
import { useEffect } from 'react';

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
    updateBillTransfers,
    error: fetchError
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
    error,
    setError,
    resetDialogStates
  } = useBillingDialogState();

  // Sync error state from fetch to dialog state
  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError, setError]);

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
    try {
      // Close any open dialogs first
      resetDialogStates();
      setError(null);
      
      // Now open the requested dialog
      await baseHandleViewBill(
        bill,
        setViewBill,
        setIsViewDialogOpen,
        setIsLoading
      );
    } catch (err: any) {
      console.error('Error viewing bill:', err);
      setError(`Error al ver factura: ${err.message}`);
    }
  };

  const handleEditBill = async (bill: Bill) => {
    try {
      // Close any open dialogs first
      resetDialogStates();
      setError(null);
      
      // Now open the requested dialog
      await baseHandleEditBill(
        bill,
        setSelectedBill,
        setIsEditDialogOpen,
        setIsLoading
      );
    } catch (err: any) {
      console.error('Error editing bill:', err);
      setError(`Error al editar factura: ${err.message}`);
    }
  };

  const handleDeleteBill = (bill: Bill) => {
    try {
      // Close any open dialogs first
      resetDialogStates();
      setError(null);
      
      // Now open the requested dialog
      baseHandleDeleteBill(
        bill,
        setSelectedBill,
        setIsDeleteDialogOpen
      );
    } catch (err: any) {
      console.error('Error preparing bill deletion:', err);
      setError(`Error al preparar la eliminación de factura: ${err.message}`);
    }
  };

  const handleFormSubmit = async (values: CreateBillDto) => {
    setError(null);
    await baseHandleFormSubmit(values);
  };

  const handleEditSubmit = async (
    id: string,
    data: Partial<Bill>,
    addedTransferIds: string[] = [],
    removedTransferIds: string[] = []
  ) => {
    setError(null);
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
    setError(null);
    await baseHandleConfirmDelete(
      selectedBill,
      setIsDeleteDialogOpen,
      setSelectedBill
    );
  };

  const handleStatusChange = async (status: Bill['status']) => {
    setError(null);
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
    error,
    
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
