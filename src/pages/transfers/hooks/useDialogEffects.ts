
import { useEffect } from 'react';

export function useDialogEffects(
  isEditDialogOpen: boolean,
  isExpenseDialogOpen: boolean,
  isSummaryDialogOpen: boolean,
  setSummaryTransferId: (id: string | null) => void
) {
  // Reset state when dialogs close
  useEffect(() => {
    if (!isEditDialogOpen && !isExpenseDialogOpen && !isSummaryDialogOpen) {
      // Give time for animations to complete before clearing state
      const timeout = setTimeout(() => {
        if (!isEditDialogOpen && !isExpenseDialogOpen && !isSummaryDialogOpen) {
          // No need to clear summaryTransferId if the summary dialog is still open
          if (!isSummaryDialogOpen) {
            setSummaryTransferId(null);
          }
        }
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isEditDialogOpen, isExpenseDialogOpen, isSummaryDialogOpen, setSummaryTransferId]);
}
