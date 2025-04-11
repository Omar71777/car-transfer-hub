
import { useState } from 'react';
import { Transfer } from '@/types';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';
import { handleExportCSV } from '../helpers/reportHelpers';
import { printTransfersList, printCollaboratorCommissionSummary } from '@/lib/exports/transfersPrintHandler';

export function usePrintHandlers(transfers: Transfer[]) {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const handlePrint = () => {
    // Open the print dialog
    setIsPrintDialogOpen(true);
  };
  
  const handleClosePrintDialog = () => {
    setIsPrintDialogOpen(false);
  };
  
  const handlePrintWithOptions = (options: PrintOptions) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    
    if (options.type === 'collaborator' && !options.filterValue) {
      // Print summary report for all collaborators
      printCollaboratorCommissionSummary(transfers);
    } else {
      // Print filtered transfer list
      printTransfersList(transfers, options);
    }
    
    // Restore pointer events after a short delay
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 100);
  };

  const handleExportTransfers = () => {
    handleExportCSV(transfers);
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
