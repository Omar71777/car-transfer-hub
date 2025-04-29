
import { useDialog } from '@/components/ui/dialog-service';
import { useDrawer } from '@/components/ui/drawer-service';
import { Transfer } from '@/types';
import { openTransferExpenseDialog } from '@/components/transfers/TransferExpenseDialog';
import { openTransferEditDialog } from '@/components/transfers/TransferEditDialog';
import { openTransferPrintDialog } from '@/components/transfers/TransferPrintDialogContent';
import { openTransferSummaryDialog } from '@/components/transfers/TransferSummaryDialogContent';
import { PrintOptions } from '@/components/transfers/TransferPrintDialog';

// Type definitions for transfer service functions
export interface TransferServiceProps {
  onExpenseSubmit: (values: any) => void;
  onEditSubmit: (values: any) => void;
  onPrintWithOptions: (options: PrintOptions) => void;
  onSummaryClose?: () => void;
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
    if (!transfer) return;
    
    openTransferEditDialog(
      dialogService,
      props.onEditSubmit,
      transfer
    );
  };
  
  // Open print dialog using the dialog service
  const openPrintDialog = (transfers: Transfer[]) => {
    openTransferPrintDialog(
      dialogService,
      props.onPrintWithOptions,
      transfers
    );
  };
  
  // Open summary dialog using the dialog service
  const openSummaryDialog = (transferId: string) => {
    openTransferSummaryDialog(
      dialogService,
      transferId,
      props.onSummaryClose
    );
  };
  
  // Return the service functions
  return {
    openExpenseDialog,
    openEditDialog,
    openPrintDialog,
    openSummaryDialog
  };
}
