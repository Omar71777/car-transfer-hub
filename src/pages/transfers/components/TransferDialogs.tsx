
import React, { useEffect, useRef } from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { Transfer } from '@/types';
import { openTransferExpenseDialog } from '@/components/transfers/TransferExpenseDialog';
import { openTransferEditDialog } from '@/components/transfers/TransferEditDialog';
import { openTransferPrintDialog } from '@/components/transfers/TransferPrintDialogContent';
import { usePointerEventsFix } from '@/hooks/use-pointer-events-fix';
import { DeleteTransferDialog } from '@/components/transfers/DeleteTransferDialog';

interface TransferDialogsProps {
  isExpenseDialogOpen: boolean;
  setIsExpenseDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isPrintDialogOpen?: boolean;
  isDeleteDialogOpen?: boolean;
  transferToDelete?: string | null;
  transfersToDelete?: string[];
  onCloseDeleteDialog?: () => void;
  onDeleteConfirm?: () => Promise<boolean>;
  onDeleteMultipleConfirm?: () => Promise<boolean>;
  onClosePrintDialog?: () => void;
  onPrintWithOptions?: (options: any) => void;
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
  isDeleteDialogOpen = false,
  transferToDelete = null,
  transfersToDelete = [],
  onCloseDeleteDialog = () => {},
  onDeleteConfirm = async () => false,
  onDeleteMultipleConfirm = async () => false,
  onClosePrintDialog = () => {},
  onPrintWithOptions = () => {},
  selectedTransferId,
  editingTransfer,
  onExpenseSubmit,
  onEditSubmit,
  transfers = []
}: TransferDialogsProps) {
  const dialogService = useDialog();
  const prevIsEditDialogOpen = useRef(false);
  const prevIsExpenseDialogOpen = useRef(false);
  const prevIsPrintDialogOpen = useRef(false);
  const isDialogOpenedRef = useRef({
    edit: false,
    expense: false,
    print: false
  });
  
  // Apply the pointer events fix hook
  usePointerEventsFix();
  
  // Handle expense dialog with the dialog service
  useEffect(() => {
    if (!selectedTransferId) return;
    
    console.log('Expense dialog state:', { 
      isOpen: isExpenseDialogOpen, 
      wasOpen: prevIsExpenseDialogOpen.current,
      isAlreadyOpened: isDialogOpenedRef.current.expense 
    });
    
    // Only open dialog when state changes from false to true and dialog not already opened
    if (isExpenseDialogOpen && !prevIsExpenseDialogOpen.current && !isDialogOpenedRef.current.expense) {
      console.log('Opening expense dialog for transfer:', selectedTransferId);
      isDialogOpenedRef.current.expense = true;
      
      openTransferExpenseDialog(
        dialogService,
        (values) => {
          onExpenseSubmit(values);
          setIsExpenseDialogOpen(false);
          // Don't reset isDialogOpenedRef here, wait until dialog is actually closed
        },
        selectedTransferId
      );
    }
    
    // When the dialog is closed, reset the opened state
    if (!isExpenseDialogOpen && prevIsExpenseDialogOpen.current) {
      // Give time for animations to complete
      setTimeout(() => {
        isDialogOpenedRef.current.expense = false;
      }, 300);
    }
    
    prevIsExpenseDialogOpen.current = isExpenseDialogOpen;
  }, [isExpenseDialogOpen, selectedTransferId, dialogService, onExpenseSubmit, setIsExpenseDialogOpen]);

  // Handle edit dialog with the dialog service
  useEffect(() => {
    if (!editingTransfer) return;
    
    console.log('Edit dialog state:', { 
      isOpen: isEditDialogOpen, 
      wasOpen: prevIsEditDialogOpen.current,
      isAlreadyOpened: isDialogOpenedRef.current.edit,
      transfer: editingTransfer?.id 
    });
    
    // Only open dialog when state changes from false to true and dialog not already opened
    if (isEditDialogOpen && !prevIsEditDialogOpen.current && !isDialogOpenedRef.current.edit) {
      console.log('Opening edit dialog for transfer:', editingTransfer.id);
      isDialogOpenedRef.current.edit = true;
      
      openTransferEditDialog(
        dialogService,
        (values) => {
          onEditSubmit(values);
          setIsEditDialogOpen(false);
          // Don't reset isDialogOpenedRef here, wait until dialog is actually closed
        },
        editingTransfer
      );
    }
    
    // When the dialog is closed, reset the opened state
    if (!isEditDialogOpen && prevIsEditDialogOpen.current) {
      // Give time for animations to complete
      setTimeout(() => {
        isDialogOpenedRef.current.edit = false;
      }, 300);
    }
    
    prevIsEditDialogOpen.current = isEditDialogOpen;
  }, [isEditDialogOpen, editingTransfer, dialogService, onEditSubmit, setIsEditDialogOpen]);
  
  // Handle print dialog with the dialog service
  useEffect(() => {
    if (transfers.length === 0) return;
    
    // Only open dialog when state changes from false to true and dialog not already opened
    if (isPrintDialogOpen && !prevIsPrintDialogOpen.current && !isDialogOpenedRef.current.print) {
      console.log('Opening print dialog for transfers:', transfers.length);
      isDialogOpenedRef.current.print = true;
      
      openTransferPrintDialog(
        dialogService,
        (options) => {
          onPrintWithOptions(options);
          onClosePrintDialog();
          // Don't reset isDialogOpenedRef here, wait until dialog is actually closed
        },
        transfers
      );
    }
    
    // When the dialog is closed, reset the opened state
    if (!isPrintDialogOpen && prevIsPrintDialogOpen.current) {
      // Give time for animations to complete
      setTimeout(() => {
        isDialogOpenedRef.current.print = false;
      }, 300);
    }
    
    prevIsPrintDialogOpen.current = isPrintDialogOpen;
  }, [isPrintDialogOpen, transfers, dialogService, onPrintWithOptions, onClosePrintDialog]);

  // Reset dialog state when component unmounts
  useEffect(() => {
    return () => {
      console.log('TransferDialogs component unmounting, resetting state');
      isDialogOpenedRef.current = { edit: false, expense: false, print: false };
    };
  }, []);

  // Determine if we're deleting multiple transfers or a single one
  const isMultipleDelete = transfersToDelete.length > 0;
  const deleteConfirmHandler = isMultipleDelete ? onDeleteMultipleConfirm : onDeleteConfirm;

  return (
    <>
      {/* Delete Transfer Dialog */}
      <DeleteTransferDialog
        open={isDeleteDialogOpen}
        onOpenChange={onCloseDeleteDialog}
        onConfirm={deleteConfirmHandler}
        isMultiple={isMultipleDelete}
        count={transfersToDelete.length}
      />
    </>
  );
}
