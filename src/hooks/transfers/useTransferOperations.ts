
import { useCallback } from 'react';
import { Transfer } from '@/types';
import { createTransfer as createTransferUtil } from './operations/createTransfer';
import { updateTransfer as updateTransferUtil } from './operations/updateTransfer';
import { deleteTransfer as deleteTransferUtil } from './operations/deleteTransfer';
import { getTransfer as getTransferUtil } from './operations/getTransfer';
import { updateTransferBilledStatus as updateBilledStatusUtil } from './operations/updateTransferBilledStatus';

export function useTransferOperations(user?: any) {
  const createTransfer = useCallback(async (transferData: any) => {
    return createTransferUtil(user, transferData);
  }, [user]);

  const updateTransfer = useCallback(async (id: string, transferData: Partial<Transfer>) => {
    return updateTransferUtil(user, id, transferData);
  }, [user]);

  const deleteTransfer = useCallback(async (id: string) => {
    return deleteTransferUtil(user, id);
  }, [user]);

  const getTransfer = useCallback(async (id: string) => {
    return getTransferUtil(id);
  }, []);

  const updateTransferBilledStatus = useCallback(async (transferIds: string[], billed: boolean) => {
    return updateBilledStatusUtil(user, transferIds, billed);
  }, [user]);

  return { 
    createTransfer, 
    updateTransfer, 
    deleteTransfer, 
    getTransfer,
    updateTransferBilledStatus 
  };
}
