
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useFetchTransfers } from './useFetchTransfers';
import { useTransferOperations } from './useTransferOperations';

export function useTransfers() {
  const { user } = useAuth();
  
  // Get the fetch functionality
  const { 
    transfers,
    expenses,
    loading,
    fetchTransfers,
    fetchTransfersInRange,
    fetchTransferById,
    setTransfers
  } = useFetchTransfers(user);
  
  // Get operations functionality
  const {
    createTransfer,
    updateTransfer,
    deleteTransfer,
    getTransfer
  } = useTransferOperations(user);

  return {
    transfers,
    expenses,
    loading,
    fetchTransfers,
    fetchTransfersInRange,
    fetchTransferById,
    createTransfer,
    updateTransfer,
    deleteTransfer,
    getTransfer
  };
}
