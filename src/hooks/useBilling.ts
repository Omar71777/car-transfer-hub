
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

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBills(data || []);
    } catch (error: any) {
      toast.error(`Error fetching bills: ${error.message}`);
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBill = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*, client:clients(*), items:bill_items(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Bill | null;
    } catch (error: any) {
      toast.error(`Error fetching bill: ${error.message}`);
      console.error('Error fetching bill:', error);
      return null;
    }
  }, []);

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

  const createBill = useCallback(async (billData: CreateBillDto) => {
    try {
      const preview = await calculateBillPreview(
        billData.clientId,
        billData.transferIds,
        billData.taxRate,
        billData.taxApplication
      );
      
      if (!preview) throw new Error('Failed to calculate bill preview');

      // Generate a unique bill number (can be more sophisticated in a real app)
      const billNumber = `BILL-${Date.now().toString().substring(7)}`;

      // First, create the bill
      const { data: billResult, error: billError } = await supabase
        .from('bills')
        .insert({
          client_id: billData.clientId,
          number: billNumber,
          date: billData.date,
          due_date: billData.dueDate,
          sub_total: preview.subTotal,
          tax_rate: billData.taxRate,
          tax_amount: preview.taxAmount,
          tax_application: billData.taxApplication,
          total: preview.total,
          notes: billData.notes,
          status: 'draft',
        })
        .select()
        .single();

      if (billError) throw billError;

      // Then, create bill items
      const billItems = preview.items.map((item) => ({
        bill_id: billResult.id,
        transfer_id: item.transfer.id,
        description: item.description,
        quantity: 1,
        unit_price: item.unitPrice,
        total_price: item.unitPrice,
      }));

      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItems);

      if (itemsError) throw itemsError;

      // Update transfers to mark them as billed
      const { error: transfersError } = await supabase
        .from('transfers')
        .update({ billed: true })
        .in('id', billData.transferIds);

      if (transfersError) throw transfersError;

      return billResult.id;
    } catch (error: any) {
      toast.error(`Error creating bill: ${error.message}`);
      console.error('Error creating bill:', error);
      return null;
    }
  }, [calculateBillPreview]);

  const updateBillStatus = useCallback(async (id: string, status: Bill['status']) => {
    try {
      const { error } = await supabase
        .from('bills')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error(`Error updating bill status: ${error.message}`);
      console.error('Error updating bill status:', error);
      return false;
    }
  }, []);

  const deleteBill = useCallback(async (id: string) => {
    try {
      // First, get the transfers associated with this bill
      const { data: billItems, error: itemsError } = await supabase
        .from('bill_items')
        .select('transfer_id')
        .eq('bill_id', id);

      if (itemsError) throw itemsError;

      // Delete the bill items
      const { error: deleteItemsError } = await supabase
        .from('bill_items')
        .delete()
        .eq('bill_id', id);

      if (deleteItemsError) throw deleteItemsError;

      // Update transfers to mark them as not billed
      if (billItems && billItems.length > 0) {
        const transferIds = billItems.map(item => item.transfer_id);
        const { error: transfersError } = await supabase
          .from('transfers')
          .update({ billed: false })
          .in('id', transferIds);

        if (transfersError) throw transfersError;
      }

      // Delete the bill
      const { error: billError } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (billError) throw billError;

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
