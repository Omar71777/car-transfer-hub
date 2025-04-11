
import React from 'react';
import { TransferExpenseDialog } from '@/components/transfers/TransferExpenseDialog';
import { TransferEditDialog } from '@/components/transfers/TransferEditDialog';
import { TransferPrintDialog, PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { Transfer } from '@/types';

interface TransferDialogsProps {
  isExpenseDialogOpen: boolean;
  setIsExpenseDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isPrintDialogOpen?: boolean;
  onClosePrintDialog?: () => void;
  onPrintWithOptions?: (options: PrintOptions) => void;
  selectedTransferId: string | null;
  editingTransfer: Transfer | null;
  onExpenseSubmit: (values: any) => void;
  onEditSubmit: (values: any) => void;
  transfers?: Transfer[];
}

export function TransferDialogs({
  isExpenseDialogOpen,
  setIsExpenseDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isPrintDialogOpen = false,
  onClosePrintDialog = () => {},
  onPrintWithOptions = () => {},
  selectedTransferId,
  editingTransfer,
  onExpenseSubmit,
  onEditSubmit,
  transfers = []
}: TransferDialogsProps) {
  return (
    <>
      {isExpenseDialogOpen && (
        <TransferExpenseDialog
          isOpen={isExpenseDialogOpen}
          onClose={() => setIsExpenseDialogOpen(false)}
          onSubmit={onExpenseSubmit}
          transferId={selectedTransferId}
        />
      )}
      
      {isEditDialogOpen && editingTransfer && (
        <TransferEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={onEditSubmit}
          transfer={editingTransfer}
        />
      )}
      
      {isPrintDialogOpen && (
        <TransferPrintDialog 
          isOpen={isPrintDialogOpen}
          onClose={onClosePrintDialog}
          onPrint={onPrintWithOptions}
          transfers={transfers}
        />
      )}
    </>
  );
}
