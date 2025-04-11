
import { useState, useEffect, useCallback } from 'react';
import { Transfer } from '@/types';
import { useFetchTransfers } from './useFetchTransfers';
import { useAuth } from '@/contexts/auth';
import { useTransferOperations } from './useTransferOperations';

export function useTransfers() {
  const { user } = useAuth();
  const { 
    transfers, 
    expenses, 
    loading, 
    error,
    fetchTransfers, 
    fetchTransfersInRange,
    fetchTransferById,
    setTransfers 
  } = useFetchTransfers(user);
  
  const { 
    createTransfer, 
    updateTransfer, 
    deleteTransfer,
    getTransfer,
    updateTransferBilledStatus
  } = useTransferOperations(user);

  // Refetch transfers when user changes
  useEffect(() => {
    if (user) {
      fetchTransfers();
    }
  }, [user, fetchTransfers]);

  const handleCreateTransfer = useCallback(async (transferData: Omit<Transfer, 'id'>) => {
    const id = await createTransfer(transferData);
    if (id) {
      fetchTransfers();
    }
    return id;
  }, [createTransfer, fetchTransfers]);

  const handleUpdateTransfer = useCallback(async (id: string, transferData: Partial<Transfer>) => {
    const success = await updateTransfer(id, transferData);
    if (success) {
      fetchTransfers();
    }
    return success;
  }, [updateTransfer, fetchTransfers]);

  const handleDeleteTransfer = useCallback(async (id: string) => {
    const success = await deleteTransfer(id);
    if (success) {
      fetchTransfers();
    }
    return success;
  }, [deleteTransfer, fetchTransfers]);

  const handleUpdateBilledStatus = useCallback(async (transferIds: string[], billed: boolean) => {
    const success = await updateTransferBilledStatus(transferIds, billed);
    if (success) {
      fetchTransfers();
    }
    return success;
  }, [updateTransferBilledStatus, fetchTransfers]);

  return {
    transfers,
    expenses,
    loading,
    error,
    fetchTransfers,
    fetchTransfersInRange,
    fetchTransferById,
    getTransfer,
    createTransfer: handleCreateTransfer,
    updateTransfer: handleUpdateTransfer,
    deleteTransfer: handleDeleteTransfer,
    updateTransferBilledStatus: handleUpdateBilledStatus,
    setTransfers
  };
}
