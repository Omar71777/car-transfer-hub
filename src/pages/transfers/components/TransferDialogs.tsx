
import React, { useEffect } from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { Transfer } from '@/types';
import { 
  openTransferExpenseDialog
} from '@/components/transfers/TransferExpenseDialog';
import { openTransferEditDialog } from '@/components/transfers/TransferEditDialog';
import { TransferPrintDialog, PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { usePointerEventsFix } from '@/hooks/use-pointer-events-fix';

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
  
  // Apply the pointer events fix hook
  usePointerEventsFix();
  
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

  // Handle edit dialog with the new dialog service
  useEffect(() => {
    if (isEditDialogOpen && editingTransfer) {
      openTransferEditDialog(
        dialogService,
        (values) => {
          onEditSubmit(values);
          setIsEditDialogOpen(false);
        },
        editingTransfer
      );
    }
  }, [isEditDialogOpen, editingTransfer, dialogService]);

  return (
    <>
      {/* Legacy dialog components for backward compatibility */}
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
