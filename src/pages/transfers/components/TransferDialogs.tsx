
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { TransferForm } from '@/components/transfers/TransferForm';
import { Transfer } from '@/types';

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
  return (
    <>
      {isExpenseDialogOpen && (
        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Gasto al Transfer</DialogTitle>
              <DialogDescription>
                Introduce los detalles del gasto que deseas añadir a este transfer.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm onSubmit={onExpenseSubmit} transferId={selectedTransferId || ''} />
          </DialogContent>
        </Dialog>
      )}

      {isEditDialogOpen && editingTransfer && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-[min(800px,90vw)]">
            <DialogHeader>
              <DialogTitle>Editar Transfer</DialogTitle>
              <DialogDescription>
                Modifica los detalles del transfer seleccionado.
              </DialogDescription>
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
