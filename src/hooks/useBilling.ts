import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bill, BillPreview, CreateBillDto, TaxApplicationType } from '@/types/billing';
import { useTransfers } from './useTransfers';
import { useClients } from './useClients';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function useBilling() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const { getTransfer, updateTransfer } = useTransfers();
  const { getClient } = useClients();

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          client:client_id (
            id,
            name,
            email,
            phone,
            address,
            tax_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBills(data as unknown as Bill[]);
      setLoading(false);
    } catch (error: any) {
      toast.error(`Error al cargar facturas: ${error.message}`);
      console.error('Error fetching bills:', error);
      setLoading(false);
    }
  }, []);

  const getBill = useCallback(async (id: string) => {
    try {
      const { data: bill, error } = await supabase
        .from('bills')
        .select(`
          *,
          client:client_id (
            id,
            name,
            email,
            phone,
            address,
            tax_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const { data: items, error: itemsError } = await supabase
        .from('bill_items')
        .select('*')
        .eq('bill_id', id);

      if (itemsError) throw itemsError;
      
      return {
        ...bill,
        items: items || []
      } as unknown as Bill;
    } catch (error: any) {
      toast.error(`Error al obtener factura: ${error.message}`);
      console.error('Error fetching bill:', error);
      return null;
    }
  }, []);

  const calculateBillPreview = useCallback(
    async (clientId: string, transferIds: string[], taxRate: number, taxApplication: TaxApplicationType) => {
      try {
        const client = await getClient(clientId);
        if (!client) throw new Error('Cliente no encontrado');

        let items = [];
        let subTotal = 0;

        for (const transferId of transferIds) {
          const transfer = await getTransfer(transferId);
          if (!transfer) continue;

          const item = {
            transfer,
            description: `Transfer desde ${transfer.origin} hasta ${transfer.destination} el ${transfer.date}`,
            unitPrice: transfer.price,
          };

          items.push(item);
          subTotal += transfer.price;
        }

        let taxAmount = 0;
        let total = 0;

        if (taxApplication === 'included') {
          taxAmount = (subTotal * taxRate) / (100 + taxRate);
          total = subTotal;
        } else {
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
        toast.error(`Error al calcular vista previa: ${error.message}`);
        console.error('Error calculating bill preview:', error);
        return null;
      }
    },
    [getClient, getTransfer]
  );

  const generateBillNumber = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('bills')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      
      const year = new Date().getFullYear();
      const number = (count || 0) + 1;
      
      return `FACTURA-${year}-${number.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating bill number:', error);
      return `FACTURA-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    }
  }, []);

  const createBill = useCallback(async (billData: CreateBillDto) => {
    try {
      const preview = await calculateBillPreview(
        billData.clientId,
        billData.transferIds,
        billData.taxRate,
        billData.taxApplication
      );
      
      if (!preview) throw new Error('No se pudo calcular la vista previa de la factura');
      
      const billNumber = await generateBillNumber();
      
      const { data: bill, error: billError } = await supabase
        .from('bills')
        .insert([{
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
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (billError) throw billError;
      
      const billItems = [];
      
      for (const item of preview.items) {
        billItems.push({
          bill_id: bill.id,
          transfer_id: item.transfer.id,
          description: item.description,
          quantity: 1,
          unit_price: item.unitPrice,
          total_price: item.unitPrice,
        });
        
        await updateTransfer(item.transfer.id, { billed: true });
      }
      
      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItems);

      if (itemsError) throw itemsError;
      
      toast.success('Factura creada con éxito');
      return bill.id;
    } catch (error: any) {
      toast.error(`Error al crear factura: ${error.message}`);
      console.error('Error creating bill:', error);
      return null;
    }
  }, [calculateBillPreview, generateBillNumber, updateTransfer]);

  const updateBillStatus = useCallback(async (id: string, status: Bill['status']) => {
    try {
      const statusMessage = {
        draft: 'borrador',
        sent: 'enviada',
        paid: 'pagada',
        cancelled: 'cancelada'
      };
      
      const { error } = await supabase
        .from('bills')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Estado de la factura actualizado a "${statusMessage[status]}"`);
      return true;
    } catch (error: any) {
      toast.error(`Error al actualizar estado de factura: ${error.message}`);
      console.error('Error updating bill status:', error);
      return false;
    }
  }, []);

  const deleteBill = useCallback(async (id: string) => {
    try {
      const { data: billItems, error: itemsQueryError } = await supabase
        .from('bill_items')
        .select('transfer_id')
        .eq('bill_id', id);

      if (itemsQueryError) throw itemsQueryError;
      
      const { error: itemsDeleteError } = await supabase
        .from('bill_items')
        .delete()
        .eq('bill_id', id);

      if (itemsDeleteError) throw itemsDeleteError;
      
      for (const item of billItems || []) {
        await updateTransfer(item.transfer_id, { billed: false });
      }
      
      const { error: billDeleteError } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (billDeleteError) throw billDeleteError;
      
      toast.success('Factura eliminada con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al eliminar factura: ${error.message}`);
      console.error('Error deleting bill:', error);
      return false;
    }
  }, [updateTransfer]);

  const exportBillCsv = useCallback(async (id: string) => {
    try {
      const bill = await getBill(id);
      if (!bill) throw new Error('Factura no encontrada');
      
      const { exportBillCsv } = await import('@/lib/exports/billExport');
      exportBillCsv(bill);
      
      return true;
    } catch (error: any) {
      toast.error(`Error al exportar factura: ${error.message}`);
      console.error('Error exporting bill:', error);
      return false;
    }
  }, [getBill]);

  const printBill = useCallback(async (id: string) => {
    try {
      const bill = await getBill(id);
      if (!bill) throw new Error('Factura no encontrada');
      
      const { printBill } = await import('@/lib/exports/billExport');
      printBill(bill);
      
      return true;
    } catch (error: any) {
      toast.error(`Error al imprimir factura: ${error.message}`);
      console.error('Error printing bill:', error);
      return false;
    }
  }, [getBill]);

  return {
    bills,
    loading,
    fetchBills,
    getBill,
    calculateBillPreview,
    createBill,
    updateBillStatus,
    deleteBill,
    exportBillCsv,
    printBill
  };
}
