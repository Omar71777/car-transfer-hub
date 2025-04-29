
import { useState, useCallback } from 'react';
import { Transfer } from '@/types';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { printTransfersList, printCollaboratorCommissionSummary } from '@/lib/exports/transfersPrintHandler';
import { useDialog } from '@/components/ui/dialog-service';
import { openTransferPrintDialog } from '@/components/transfers/TransferPrintDialogContent';

export function usePrintHandlers(transfers: Transfer[]) {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const dialogService = useDialog();

  const handlePrint = useCallback(() => {
    openTransferPrintDialog(
      dialogService,
      handlePrintWithOptions,
      transfers
    );
  }, [dialogService, transfers]);

  const handleClosePrintDialog = useCallback(() => {
    setIsPrintDialogOpen(false);
  }, []);

  const handlePrintWithOptions = useCallback((options: PrintOptions) => {
    printTransfersList(transfers, options);
  }, [transfers]);

  const handleExportTransfers = useCallback(() => {
    // This function is kept as a placeholder but its functionality has been removed
    console.log('Export to CSV functionality has been removed');
  }, []);

  return {
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    handlePrint,
    handleClosePrintDialog,
    handlePrintWithOptions,
    handleExportTransfers
  };
}
