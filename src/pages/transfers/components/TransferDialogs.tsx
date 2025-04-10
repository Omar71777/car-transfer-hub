
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
  
  return (
    <>
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className={isMobile ? "max-w-[95vw] p-4 rounded-lg" : ""}>
          <DialogHeader>
            <DialogTitle>Añadir Gasto al Transfer</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSubmit={onExpenseSubmit} transferId={selectedTransferId || ''} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={isMobile ? "max-w-[95vw] p-4 rounded-lg" : "sm:max-w-[600px]"}>
          <DialogHeader>
            <DialogTitle>Editar Transfer</DialogTitle>
          </DialogHeader>
          {editingTransfer && (
            <TransferForm 
              onSubmit={onEditSubmit} 
              initialValues={editingTransfer} 
              isEditing={true} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
