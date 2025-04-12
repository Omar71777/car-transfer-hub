
import { useState } from 'react';
import { Transfer } from '@/types';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { printTransfersList, printCollaboratorCommissionSummary } from '@/lib/exports/transfersPrintHandler';

export function usePrintHandlers(transfers: Transfer[]) {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const handlePrint = () => {
    setIsPrintDialogOpen(true);
  };

  const handleClosePrintDialog = () => {
    setIsPrintDialogOpen(false);
  };

  const handlePrintWithOptions = (options: PrintOptions) => {
    printTransfersList(transfers, options);
    setIsPrintDialogOpen(false);
  };

  const handleExportTransfers = () => {
    // This function is kept as a placeholder but its functionality has been removed
    console.log('Export to CSV functionality has been removed');
  };

  return {
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    handlePrint,
    handleClosePrintDialog,
    handlePrintWithOptions,
    handleExportTransfers
  };
}
