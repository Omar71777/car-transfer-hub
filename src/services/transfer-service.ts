
import { useDialog } from '@/components/ui/dialog-service';
import { useDrawer } from '@/components/ui/drawer-service';
import { Transfer } from '@/types';
import { openTransferExpenseDialog } from '@/components/transfers/TransferExpenseDialog';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';

// Type definitions for transfer service functions
export interface TransferServiceProps {
  onExpenseSubmit: (values: any) => void;
  onEditSubmit: (values: any) => void;
  onPrintWithOptions: (options: PrintOptions) => void;
}

// Service hook for managing transfer operations
export function useTransferService(props: TransferServiceProps) {
  const dialogService = useDialog();
  const drawerService = useDrawer();
  
  // Open expense dialog using the dialog service
  const openExpenseDialog = (transferId: string | null) => {
    if (!transferId) return;
    
    openTransferExpenseDialog(
      dialogService,
      props.onExpenseSubmit,
      transferId
    );
  };
  
  // Open edit dialog using the dialog service
  const openEditDialog = (transfer: Transfer) => {
    // This will be implemented when the TransferEditDialog is refactored
    // For now, return a placeholder
    console.log("Edit dialog not yet refactored to use dialog service", transfer);
  };
  
  // Open print dialog using the dialog service
  const openPrintDialog = (transfers: Transfer[]) => {
    // This will be implemented when the TransferPrintDialog is refactored
    // For now, return a placeholder
    console.log("Print dialog not yet refactored to use dialog service", transfers);
  };
  
  // Return the service functions
  return {
    openExpenseDialog,
    openEditDialog,
    openPrintDialog
  };
}
