
import React, { useEffect } from 'react';
import { useDialog } from '@/components/ui/dialog-service';
import { openTransferSummaryDialog } from '@/components/transfers/TransferSummaryDialogContent';

interface TransferSummaryDialogContainerProps {
  isOpen: boolean;
  onClose: () => void;
  transferId: string | null;
}

export function TransferSummaryDialogContainer({
  isOpen,
  onClose,
  transferId
}: TransferSummaryDialogContainerProps) {
  const dialogService = useDialog();
  
  useEffect(() => {
    if (isOpen && transferId) {
      openTransferSummaryDialog(dialogService, transferId, onClose);
    }
  }, [isOpen, transferId, dialogService, onClose]);
  
  return null;
}
