
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bill, BillPreview, CreateBillDto, TaxApplicationType } from '@/types/billing';
import { useTransfers } from './useTransfers';
import { useClients } from './useClients';
import { toast } from 'sonner';

export function useBilling() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const { getTransfer } = useTransfers();
  const { getClient } = useClients();

  // Since we might not have the database tables yet, this is a temporary solution
  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      // For the temporary implementation, just return an empty array
      setBills([]);
      setLoading(false);
    } catch (error: any) {
      toast.error(`Error fetching bills: ${error.message}`);
      console.error('Error fetching bills:', error);
      setLoading(false);
    }
  }, []);

  const getBill = useCallback(async (id: string) => {
    try {
      // For now, just simulate getting a bill since we don't have the actual DB tables
      return null;
    } catch (error: any) {
      toast.error(`Error fetching bill: ${error.message}`);
      console.error('Error fetching bill:', error);
      return null;
    }
  }, []);

  // This function will work with our existing data even without DB tables
  const calculateBillPreview = useCallback(
    async (clientId: string, transferIds: string[], taxRate: number, taxApplication: TaxApplicationType) => {
      try {
        const client = await getClient(clientId);
        if (!client) throw new Error('Client not found');

        const items = [];
        let subTotal = 0;

        for (const transferId of transferIds) {
          const transfer = await getTransfer(transferId);
          if (!transfer) continue;

          const item = {
            transfer,
            description: `Transfer from ${transfer.origin} to ${transfer.destination} on ${transfer.date}`,
            unitPrice: transfer.price,
          };

          items.push(item);
          subTotal += transfer.price;
        }

        let taxAmount = 0;
        let total = 0;

        if (taxApplication === 'included') {
          // Tax is already included in the price
          taxAmount = (subTotal * taxRate) / (100 + taxRate);
          total = subTotal;
        } else {
          // Tax is added on top of the price
          taxAmount = (subTotal * taxRate) / 100;
          total = subTotal + taxAmount;
        }

        return {
          client,
          items,
          subTotal,
          taxRate,
          taxAmount,
          taxApplication,
          total,
        } as BillPreview;
      } catch (error: any) {
        toast.error(`Error calculating bill preview: ${error.message}`);
        console.error('Error calculating bill preview:', error);
        return null;
      }
    },
    [getClient, getTransfer]
  );

  // Temporarily implement this with a mock
  const createBill = useCallback(async (billData: CreateBillDto) => {
    try {
      // Just display a toast and return a fake ID for now
      toast.success('This is a temporary implementation. Database tables need to be created.');
      return 'temp-id-' + Date.now();
    } catch (error: any) {
      toast.error(`Error creating bill: ${error.message}`);
      console.error('Error creating bill:', error);
      return null;
    }
  }, []);

  // Temporary implementation
  const updateBillStatus = useCallback(async (id: string, status: Bill['status']) => {
    try {
      toast.success(`Bill status would be updated to ${status}`);
      return true;
    } catch (error: any) {
      toast.error(`Error updating bill status: ${error.message}`);
      console.error('Error updating bill status:', error);
      return false;
    }
  }, []);

  // Temporary implementation
  const deleteBill = useCallback(async (id: string) => {
    try {
      toast.success('Bill would be deleted');
      return true;
    } catch (error: any) {
      toast.error(`Error deleting bill: ${error.message}`);
      console.error('Error deleting bill:', error);
      return false;
    }
  }, []);

  return {
    bills,
    loading,
    fetchBills,
    getBill,
    calculateBillPreview,
    createBill,
    updateBillStatus,
    deleteBill,
  };
}
