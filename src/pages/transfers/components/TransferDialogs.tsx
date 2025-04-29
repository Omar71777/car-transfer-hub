
import React, { useEffect } from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { Transfer } from '@/types';
import { 
  openTransferExpenseDialog, 
  TransferExpenseDialog 
} from '@/components/transfers/TransferExpenseDialog';
import { TransferEditDialog } from '@/components/transfers/TransferEditDialog';
import { TransferPrintDialog, PrintOptions } from '@/components/transfers/TransferPrintDialog';

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
  const dialogService = useDialog();
  
  // Handle expense dialog with the new dialog service
  useEffect(() => {
    if (isExpenseDialogOpen && selectedTransferId) {
      openTransferExpenseDialog(
        dialogService,
        (values) => {
          onExpenseSubmit(values);
          setIsExpenseDialogOpen(false);
        },
        selectedTransferId
      );
    }
  }, [isExpenseDialogOpen, selectedTransferId, dialogService]);

  return (
    <>
      {/* Legacy dialog components for backward compatibility */}
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
