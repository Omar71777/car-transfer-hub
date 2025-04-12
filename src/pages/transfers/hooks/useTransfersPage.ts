
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
  
  // Initialize expense handlers hook
  const expenseHandlers = useExpenseHandlers(
    createExpense,
    fetchTransfers,
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
    handleDeleteTransfer: transferOperations.handleDeleteTransfer,
    handleDeleteMultipleTransfers: transferOperations.handleDeleteMultipleTransfers,
    handleExpenseSubmit: expenseHandlers.handleExpenseSubmit,
    handlePrint: printHandlers.handlePrint,
    handleExportTransfers: printHandlers.handleExportTransfers,
    handleClosePrintDialog: printHandlers.handleClosePrintDialog,
    handlePrintWithOptions: printHandlers.handlePrintWithOptions,
    handleMarkAsPaid: transferOperations.handleMarkAsPaid
  };
}
