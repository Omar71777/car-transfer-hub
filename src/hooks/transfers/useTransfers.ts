
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useFetchTransfers } from './useFetchTransfers';
import { useTransferOperations } from './useTransferOperations';

export function useTransfers() {
  const { user } = useAuth();
  
  // Get the fetch functionality
  const { 
    transfers,
    loading,
    fetchTransfers,
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
    loading,
    fetchTransfers,
    createTransfer,
    updateTransfer,
    deleteTransfer,
    getTransfer
  };
}
