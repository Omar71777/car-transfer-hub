
import { useState } from 'react';
import { Transfer } from '@/types';
import { toast } from 'sonner';

export function useTransferDialogs() {
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  const [activeTab, setActiveTab] = useState('manage');
  
  const handleEditTransfer = (transfer: Transfer) => {
    setEditingTransfer(transfer);
    setIsEditDialogOpen(true);
  };
  
  const handleAddExpense = (transferId: string) => {
    setSelectedTransferId(transferId);
    setIsExpenseDialogOpen(true);
  };

  return {
    selectedTransferId,
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingTransfer,
    setEditingTransfer,
    activeTab,
    setActiveTab,
    handleEditTransfer,
    handleAddExpense
  };
}
