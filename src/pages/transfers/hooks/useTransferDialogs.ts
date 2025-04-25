import { useState } from 'react';
import { Transfer } from '@/types';

export function useTransferDialogs() {
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('transfers'); // Set default tab to 'transfers'
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  
  const handleEditTransfer = (transfer: Transfer) => {
    setEditingTransfer(transfer);
    setIsEditDialogOpen(true);
  };

  return {
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    activeTab,
    setActiveTab,
    editingTransfer,
    handleEditTransfer
  };
}
