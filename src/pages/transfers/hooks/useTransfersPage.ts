
import { useState, useEffect, useCallback } from 'react';
import { useTransfers } from '@/hooks/transfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useAuth } from '@/contexts/auth';
import { Transfer } from '@/types';
import { useTransferDialogs } from './useTransferDialogs';
import { toast } from 'sonner';
import { handleExportCSV, generateReportStats } from '../helpers/reportHelpers';
import { printProfitReport } from '@/lib/exports';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { printTransfersList, printCollaboratorCommissionSummary } from '@/lib/exports/transfersPrintHandler';

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
    selectedTransferId,
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingTransfer,
    activeTab,
    setActiveTab,
    handleEditTransfer,
    handleAddExpense
  } = useTransferDialogs();

  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryTransferId, setSummaryTransferId] = useState<string | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  // Global cleanup for pointer events issues
  useEffect(() => {
    // Ensure pointer-events are always enabled when component mounts
    document.body.style.pointerEvents = 'auto';
    
    // Create a MutationObserver to watch for style changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const bodyStyle = document.body.style;
          if (bodyStyle.pointerEvents === 'none') {
            // Fix it after a short delay to allow other code to finish
            setTimeout(() => {
              document.body.style.pointerEvents = 'auto';
            }, 100);
          }
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    
    // Clean up
    return () => {
      observer.disconnect();
      document.body.style.pointerEvents = 'auto';
    };
  }, []);
  
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);
  
  // Reset state when dialogs close
  useEffect(() => {
    if (!isEditDialogOpen && !isExpenseDialogOpen && !isSummaryDialogOpen) {
      // Give time for animations to complete before clearing state
      const timeout = setTimeout(() => {
        if (!isEditDialogOpen && !isExpenseDialogOpen && !isSummaryDialogOpen) {
          // No need to clear summaryTransferId if the summary dialog is still open
          if (!isSummaryDialogOpen) {
            setSummaryTransferId(null);
          }
        }
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isEditDialogOpen, isExpenseDialogOpen, isSummaryDialogOpen]);
  
  const handleEditSubmit = async (values: any) => {
    if (!editingTransfer) return;
    
    // Convert string values to numbers for the API call
    const processedValues = {
      ...values,
      price: Number(values.price),
      commission: values.commission && values.commission !== '' ? Number(values.commission) : undefined,
    };
    
    const success = await updateTransfer(editingTransfer.id, processedValues);
    if (success) {
      setIsEditDialogOpen(false);
      toast.success("Transfer actualizado");
      fetchTransfers();
    }
  };
  
  const handleDeleteTransfer = async (id: string) => {
    const success = await deleteTransfer(id);
    if (success) {
      toast.success("Transfer eliminado");
      fetchTransfers();
    }
  };
  
  const handleDeleteMultipleTransfers = async (ids: string[]) => {
    let successCount = 0;
    
    for (const id of ids) {
      const success = await deleteTransfer(id);
      if (success) successCount++;
    }
    
    if (successCount === ids.length) {
      toast.success(`${successCount} transfers eliminados correctamente`);
    } else if (successCount > 0) {
      toast.warning(`${successCount} de ${ids.length} transfers eliminados. Algunos no pudieron ser eliminados.`);
    } else {
      toast.error("No se pudo eliminar ningún transfer");
    }
    
    fetchTransfers();
  };
  
  const handleExpenseSubmit = async (values: any) => {
    const expenseId = await createExpense({
      transferId: selectedTransferId || '',
      date: values.date,
      concept: values.concept,
      amount: parseFloat(values.amount)
    });
    
    if (expenseId) {
      setIsExpenseDialogOpen(false);
      toast.success("Gasto añadido al transfer");
      fetchTransfers();
    }
  };

  const handleViewSummary = (transferId: string) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setSummaryTransferId(transferId);
    setIsSummaryDialogOpen(true);
  };

  const handleCloseSummary = () => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsSummaryDialogOpen(false);
    // We'll let the useEffect handle clearing summaryTransferId after animation completes
  };

  const handlePrint = () => {
    // Open the print dialog
    setIsPrintDialogOpen(true);
  };
  
  const handleClosePrintDialog = () => {
    setIsPrintDialogOpen(false);
  };
  
  const handlePrintWithOptions = (options: PrintOptions) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    
    if (options.type === 'collaborator' && !options.filterValue) {
      // Print summary report for all collaborators
      printCollaboratorCommissionSummary(transfers);
    } else {
      // Print filtered transfer list
      printTransfersList(transfers, options);
    }
    
    // Restore pointer events after a short delay
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 100);
  };

  const handleExportTransfers = () => {
    handleExportCSV(transfers);
  };

  return {
    // State
    transfers,
    expenses,
    loading,
    isExpenseDialogOpen,
    isEditDialogOpen,
    editingTransfer,
    isSummaryDialogOpen,
    summaryTransferId,
    isPrintDialogOpen,
    activeTab,
    selectedTransferId,
    
    // Actions
    setIsExpenseDialogOpen,
    setIsEditDialogOpen,
    setActiveTab,
    handleEditTransfer,
    handleAddExpense,
    handleViewSummary,
    handleCloseSummary,
    handleEditSubmit,
    handleDeleteTransfer,
    handleDeleteMultipleTransfers,
    handleExpenseSubmit,
    handlePrint,
    handleExportTransfers,
    handleClosePrintDialog,
    handlePrintWithOptions
  };
}
