
import { useEffect } from 'react';
import { useTransfers } from '@/hooks/transfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useAuth } from '@/contexts/auth';
import { useTransferDialogs } from './useTransferDialogs';
import { useDialogState } from './useDialogState';
import { usePrintHandlers } from './usePrintHandlers';
import { usePointerEventsCleanup } from './usePointerEventsCleanup';
import { useTransferOperations } from './useTransferOperations';
import { useExpenseHandlers } from './useExpenseHandlers';
import { useDialogEffects } from './useDialogEffects';

export function useTransfersPage() {
  const {
    transfers,
    loading,
    fetchTransfers,
    updateTransfer,
    deleteTransfer
  } = useTransfers();
  
  const {
    expenses,
    createExpense
  } = useExpenses();
  
  const { profile } = useAuth();
  
  const {
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    activeTab,
    setActiveTab,
    handleEditTransfer
  } = useTransferDialogs();

  // Use the refactored hooks
  const dialogState = useDialogState();
  const printHandlers = usePrintHandlers(transfers);
  
  // Apply pointer events cleanup
  usePointerEventsCleanup();
  
  // Initialize transfer operations hook
  const transferOperations = useTransferOperations(
    fetchTransfers,
    updateTransfer,
    deleteTransfer,
    setIsEditDialogOpen
  );
  
  // Initialize expense handlers hook with proper void return type
  const expenseHandlers = useExpenseHandlers(
    createExpense,
    async () => {
      await fetchTransfers();
      // No explicit return needed, void is implied
    },
    setIsExpenseDialogOpen
  );
  
  // Apply dialog effects
  useDialogEffects(
    isEditDialogOpen,
    isExpenseDialogOpen,
    dialogState.isSummaryDialogOpen,
    dialogState.setSummaryTransferId
  );
  
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  // New handler to initiate delete operation via dialog
  const handleDeleteTransferWithConfirm = (id: string) => {
    dialogState.openDeleteDialog(id);
  };

  // New handler to initiate multiple delete operation via dialog
  const handleDeleteMultipleWithConfirm = (ids: string[]) => {
    dialogState.openMultipleDeleteDialog(ids);
  };

  return {
    // State
    transfers,
    expenses,
    loading,
    isExpenseDialogOpen,
    isEditDialogOpen,
    editingTransfer: transferOperations.editingTransfer,
    isSummaryDialogOpen: dialogState.isSummaryDialogOpen,
    summaryTransferId: dialogState.summaryTransferId,
    isPrintDialogOpen: printHandlers.isPrintDialogOpen,
    activeTab,
    selectedTransferId: expenseHandlers.selectedTransferId,
    isDeleteDialogOpen: dialogState.isDeleteDialogOpen,
    transferToDelete: dialogState.transferToDelete,
    transfersToDelete: dialogState.transfersToDelete,
    
    // Actions
    setIsExpenseDialogOpen,
    setIsEditDialogOpen,
    setActiveTab,
    handleEditTransfer: (transfer) => {
      transferOperations.setEditingTransfer(transfer);
      handleEditTransfer(transfer);
    },
    handleAddExpense: expenseHandlers.handleAddExpense,
    handleViewSummary: dialogState.handleViewSummary,
    handleCloseSummary: dialogState.handleCloseSummary,
    handleEditSubmit: transferOperations.handleEditSubmit,
    handleDeleteTransfer: handleDeleteTransferWithConfirm,  // Use dialog-based version
    handleDeleteMultipleTransfers: handleDeleteMultipleWithConfirm,  // Use dialog-based version
    handleExpenseSubmit: expenseHandlers.handleExpenseSubmit,
    handlePrint: printHandlers.handlePrint,
    handleExportTransfers: printHandlers.handleExportTransfers,
    handleClosePrintDialog: printHandlers.handleClosePrintDialog,
    handlePrintWithOptions: printHandlers.handlePrintWithOptions,
    handleMarkAsPaid: transferOperations.handleMarkAsPaid,
    closeDeleteDialog: dialogState.closeDeleteDialog,
    
    // Export actual delete operations for the dialog confirm buttons
    deleteTransfer: transferOperations.handleDeleteTransfer,
    deleteMultipleTransfers: transferOperations.handleDeleteMultipleTransfers
  };
}
