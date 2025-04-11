
import { useState, useEffect } from 'react';
import { Transfer } from '@/types';

export function useDialogState() {
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryTransferId, setSummaryTransferId] = useState<string | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isSummaryDialogOpen) {
      // Give time for animations to complete before clearing state
      const timeout = setTimeout(() => {
        if (!isSummaryDialogOpen) {
          setSummaryTransferId(null);
        }
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isSummaryDialogOpen]);

  const handleViewSummary = (transferId: string) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setSummaryTransferId(transferId);
    setIsSummaryDialogOpen(true);
  };

  const handleCloseSummary = () => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsSummaryDialogOpen(false);
    // We'll let the useEffect handle clearing summaryTransferId after animation completes
  };

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
