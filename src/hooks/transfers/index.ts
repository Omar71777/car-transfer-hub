
import { useAuth } from '@/contexts/auth';
import { useFetchTransfers } from './useFetchTransfers';
import { useTransferOperations } from './useTransferOperations';
import { UseTransfersResult } from './types';

export function useTransfers(): UseTransfersResult {
  const { user } = useAuth();
  const { transfers, loading, fetchTransfers } = useFetchTransfers(user);
  const { createTransfer, updateTransfer, deleteTransfer, getTransfer } = useTransferOperations(user);

  return {
    transfers,
    loading,
    fetchTransfers,
    createTransfer,
    updateTransfer,
    deleteTransfer,
    getTransfer
  };
}
