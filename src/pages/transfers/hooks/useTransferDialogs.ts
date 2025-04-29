
import { useState, useCallback, useRef } from 'react';
import { Transfer } from '@/types';

export function useTransferDialogs() {
  // Basic dialog states
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('transfers');
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  
  // Track if dialogs should have been opened to prevent duplicate opens
  const dialogStatesRef = useRef({
    editOpened: false,
    expenseOpened: false
  });
  
  // Debug helper
  const logDialogState = (action: string, state: any) => {
    console.log(`[useTransferDialogs] ${action}:`, state);
  };
  
  const handleEditTransfer = useCallback((transfer: Transfer) => {
    logDialogState('handleEditTransfer called with', transfer);
    
    // Always update the transfer when this is called
    setEditingTransfer(transfer);
    
    // Reset dialog opened state to ensure it can be reopened
    dialogStatesRef.current.editOpened = false;
    
    // Open the dialog
    setIsEditDialogOpen(true);
  }, []);

  // Clean wrapper to ensure dialog state is properly reset
  const setEditDialogOpenAndReset = useCallback((open: boolean) => {
    logDialogState('setEditDialogOpenAndReset called with', open);
    setIsEditDialogOpen(open);
    
    if (!open) {
      // Reset the dialog opened state when closing
      dialogStatesRef.current.editOpened = false;
      
      // Reset the editing transfer when closing the dialog, but with a delay
      setTimeout(() => {
        setEditingTransfer(null);
      }, 300); // Delay to ensure dialog animation completes
    }
  }, []);

  // Clean wrapper for expense dialog
  const setExpenseDialogOpenAndReset = useCallback((open: boolean) => {
    logDialogState('setExpenseDialogOpenAndReset called with', open);
    setIsExpenseDialogOpen(open);
    
    if (!open) {
      // Reset the dialog opened state when closing
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
