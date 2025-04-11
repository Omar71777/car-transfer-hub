
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { TransferForm } from '@/components/transfers/TransferForm';
import { Transfer } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransferDialogsProps {
  isExpenseDialogOpen: boolean;
  setIsExpenseDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedTransferId: string | null;
  editingTransfer: Transfer | null;
  onExpenseSubmit: (values: any) => void;
  onEditSubmit: (values: any) => void;
}

export function TransferDialogs({
  isExpenseDialogOpen,
  setIsExpenseDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedTransferId,
  editingTransfer,
  onExpenseSubmit,
  onEditSubmit
}: TransferDialogsProps) {
  const isMobile = useIsMobile();
  
  // Only mount the dialogs when they are needed
  return (
    <>
      {isExpenseDialogOpen && (
        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle>Añadir Gasto al Transfer</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSubmit={onExpenseSubmit} transferId={selectedTransferId || ''} />
          </DialogContent>
        </Dialog>
      )}

      {isEditDialogOpen && editingTransfer && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="dialog-content max-w-[min(800px,90vw)]">
            <DialogHeader>
              <DialogTitle>Editar Transfer</DialogTitle>
            </DialogHeader>
            <TransferForm 
              onSubmit={onEditSubmit} 
              initialValues={editingTransfer} 
              isEditing={true} 
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
