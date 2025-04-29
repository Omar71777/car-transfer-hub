
import { useState, useCallback } from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { openTransferSummaryDialog } from '@/components/transfers/TransferSummaryDialogContent';

export function useDialogState() {
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryTransferId, setSummaryTransferId] = useState<string | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const dialogService = useDialog();

  const handleViewSummary = useCallback((transferId: string) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setSummaryTransferId(transferId);
    setIsSummaryDialogOpen(true);
    
    // Use the dialog service to open the summary dialog
    openTransferSummaryDialog(
      dialogService, 
      transferId, 
      () => {
        setIsSummaryDialogOpen(false);
        // We'll delay clearing the ID to allow for animations
        setTimeout(() => setSummaryTransferId(null), 300);
      }
    );
  }, [dialogService]);

  const handleCloseSummary = useCallback(() => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsSummaryDialogOpen(false);
    // We'll delay clearing the ID to allow for animations
    setTimeout(() => setSummaryTransferId(null), 300);
  }, []);

  return {
    isSummaryDialogOpen,
    setIsSummaryDialogOpen,
    summaryTransferId,
    setSummaryTransferId,
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    handleViewSummary,
    handleCloseSummary
  };
}
