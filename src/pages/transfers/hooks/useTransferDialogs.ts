
import { useState, useCallback } from 'react';
import { Transfer } from '@/types';

export function useTransferDialogs() {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('transfers'); // Set default tab to 'transfers'
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  
  const handleEditTransfer = useCallback((transfer: Transfer) => {
    setEditingTransfer(transfer);
    setIsEditDialogOpen(true);
  }, []);

  // Clean wrapper to ensure dialog state is properly reset
  const setEditDialogOpenAndReset = useCallback((open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      // Reset the editing transfer when closing the dialog
      setTimeout(() => {
        setEditingTransfer(null);
      }, 300); // Delay a bit to ensure dialog animation completes
    }
  }, []);

  return {
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen: setEditDialogOpenAndReset,
    activeTab,
    setActiveTab,
    editingTransfer,
    setEditingTransfer,
    handleEditTransfer
  };
}
