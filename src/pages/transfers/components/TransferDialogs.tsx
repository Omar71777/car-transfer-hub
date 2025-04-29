
import React, { useEffect, useRef } from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { Transfer } from '@/types';
import { openTransferExpenseDialog } from '@/components/transfers/TransferExpenseDialog';
import { openTransferEditDialog } from '@/components/transfers/TransferEditDialog';
import { openTransferPrintDialog } from '@/components/transfers/TransferPrintDialogContent';
import { usePointerEventsFix } from '@/hooks/use-pointer-events-fix';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';

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
  const prevIsEditDialogOpen = useRef(isEditDialogOpen);
  const prevIsExpenseDialogOpen = useRef(isExpenseDialogOpen);
  const prevIsPrintDialogOpen = useRef(isPrintDialogOpen);
  const dialogOpenedRef = useRef({ edit: false, expense: false, print: false });
  
  // Apply the pointer events fix hook
  usePointerEventsFix();
  
  // Handle expense dialog with the dialog service
  useEffect(() => {
    // Only open dialog when state changes from false to true
    if (isExpenseDialogOpen && !prevIsExpenseDialogOpen.current && selectedTransferId && !dialogOpenedRef.current.expense) {
      dialogOpenedRef.current.expense = true;
      
      openTransferExpenseDialog(
        dialogService,
        (values) => {
          onExpenseSubmit(values);
          setIsExpenseDialogOpen(false);
          dialogOpenedRef.current.expense = false;
        },
        selectedTransferId
      );
    } else if (!isExpenseDialogOpen) {
      dialogOpenedRef.current.expense = false;
    }
    
    prevIsExpenseDialogOpen.current = isExpenseDialogOpen;
  }, [isExpenseDialogOpen, selectedTransferId, dialogService]);

  // Handle edit dialog with the dialog service
  useEffect(() => {
    console.log('Edit dialog state:', isEditDialogOpen, prevIsEditDialogOpen.current, editingTransfer, dialogOpenedRef.current.edit);
    
    // Only open dialog when state changes from false to true
    if (isEditDialogOpen && !prevIsEditDialogOpen.current && editingTransfer && !dialogOpenedRef.current.edit) {
      dialogOpenedRef.current.edit = true;
      
      openTransferEditDialog(
        dialogService,
        (values) => {
          onEditSubmit(values);
          setIsEditDialogOpen(false);
          dialogOpenedRef.current.edit = false;
        },
        editingTransfer
      );
    } else if (!isEditDialogOpen) {
      dialogOpenedRef.current.edit = false;
    }
    
    prevIsEditDialogOpen.current = isEditDialogOpen;
  }, [isEditDialogOpen, editingTransfer, dialogService]);
  
  // Handle print dialog with the dialog service
  useEffect(() => {
    // Only open dialog when state changes from false to true
    if (isPrintDialogOpen && !prevIsPrintDialogOpen.current && transfers.length > 0 && !dialogOpenedRef.current.print) {
      dialogOpenedRef.current.print = true;
      
      openTransferPrintDialog(
        dialogService,
        (options) => {
          onPrintWithOptions(options);
          onClosePrintDialog();
          dialogOpenedRef.current.print = false;
        },
        transfers
      );
    } else if (!isPrintDialogOpen) {
      dialogOpenedRef.current.print = false;
    }
    
    prevIsPrintDialogOpen.current = isPrintDialogOpen;
  }, [isPrintDialogOpen, transfers, dialogService]);

  // Reset dialog state when component unmounts
  useEffect(() => {
    return () => {
      dialogOpenedRef.current = { edit: false, expense: false, print: false };
    };
  }, []);

  // No need to render any legacy components as all dialogs are now using the dialog service
  return null;
}
