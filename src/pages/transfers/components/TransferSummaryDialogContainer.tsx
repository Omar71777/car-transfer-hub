
import React from 'react';
import { TransferSummaryDialog } from '@/components/transfers/TransferSummaryDialog';

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
  if (!transferId) return null;
  
  return (
    <TransferSummaryDialog
      isOpen={isOpen}
      onClose={onClose}
      transferId={transferId}
    />
  );
}
