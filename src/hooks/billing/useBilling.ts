
import { useState } from 'react';
import { useFetchBills } from './useFetchBills';
import { useBillOperations } from './useBillOperations';
import { useBillGeneration } from './useBillGeneration';
import { useBillTransfers } from './useBillTransfers';
import { useBillExports } from './useBillExports';
import { useTransfers } from '@/hooks/useTransfers';
import { useClients } from '@/hooks/useClients';
import { UseBillingResult } from './types';

export function useBilling(): UseBillingResult {
  const { getTransfer, updateTransfer } = useTransfers();
  const { getClient } = useClients();
  
  // Use the specialized hooks
  const { bills, loading, error, fetchBills } = useFetchBills();
  const { getBill, updateBill, updateBillStatus, deleteBill } = useBillOperations();
  const { calculateBillPreview, createBill } = useBillGeneration(getClient, getTransfer, updateTransfer);
  const { updateBillTransfers } = useBillTransfers(getBill, getTransfer, updateTransfer);
  const { exportBillCsv, printBill } = useBillExports(getBill);

  // Compose and return all functions from the specialized hooks
  return {
    bills,
    loading,
    error,
    fetchBills,
    getBill,
    calculateBillPreview,
    createBill, 
    updateBill,
    updateBillStatus,
    deleteBill: (id: string) => deleteBill(id, updateTransfer),
    exportBillCsv,
    printBill,
    updateBillTransfers
  };
}
