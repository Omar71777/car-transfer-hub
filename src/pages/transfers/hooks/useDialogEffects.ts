
import { useEffect } from 'react';

export function useDialogEffects(
  isEditDialogOpen: boolean,
  isExpenseDialogOpen: boolean,
  isSummaryDialogOpen: boolean,
  setSummaryTransferId: (id: string | null) => void
) {
  // Reset summary transfer ID only when all dialogs are closed and summary dialog is not open
  useEffect(() => {
    if (!isEditDialogOpen && !isExpenseDialogOpen && !isSummaryDialogOpen) {
      // Give time for animations to complete before clearing state
      const timeout = setTimeout(() => {
        // Double-check all dialogs are still closed before clearing state
        if (!isSummaryDialogOpen) {
          setSummaryTransferId(null);
        }
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isEditDialogOpen, isExpenseDialogOpen, isSummaryDialogOpen, setSummaryTransferId]);
}
