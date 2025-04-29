
import { useState, useCallback, useRef } from 'react';
import { Transfer } from '@/types';

export function useTransferDialogs() {
  // Basic dialog states
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('transfers'); // Set default tab to 'transfers'
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  
  // Track if dialogs should have been opened to prevent duplicate opens
  const dialogStatesRef = useRef({
    editOpened: false,
    expenseOpened: false
  });
  
  const handleEditTransfer = useCallback((transfer: Transfer) => {
    console.log('handleEditTransfer called with:', transfer);
    setEditingTransfer(transfer);
    dialogStatesRef.current.editOpened = false;
    setIsEditDialogOpen(true);
  }, []);

  // Clean wrapper to ensure dialog state is properly reset
  const setEditDialogOpenAndReset = useCallback((open: boolean) => {
    console.log('setEditDialogOpenAndReset called with:', open);
    setIsEditDialogOpen(open);
    
    if (!open) {
      // Reset the editing transfer when closing the dialog
      dialogStatesRef.current.editOpened = false;
      setTimeout(() => {
        setEditingTransfer(null);
      }, 300); // Delay a bit to ensure dialog animation completes
    }
  }, []);

  // Clean wrapper for expense dialog
  const setExpenseDialogOpenAndReset = useCallback((open: boolean) => {
    setIsExpenseDialogOpen(open);
    
    if (!open) {
      dialogStatesRef.current.expenseOpened = false;
    }
  }, []);

  return {
    isExpenseDialogOpen,
    setIsExpenseDialogOpen: setExpenseDialogOpenAndReset,
    isEditDialogOpen,
    setIsEditDialogOpen: setEditDialogOpenAndReset,
    activeTab,
    setActiveTab,
    editingTransfer,
    setEditingTransfer,
    handleEditTransfer
  };
}
