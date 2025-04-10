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

  const updateBill = useCallback(async (id: string, data: Partial<Bill>) => {
    try {
      // Filtramos solo los campos que se pueden actualizar
      const updateData: any = {};
      
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.date !== undefined) updateData.date = data.date;
      if (data.due_date !== undefined) updateData.due_date = data.due_date;
      if (data.tax_rate !== undefined) updateData.tax_rate = data.tax_rate;
      if (data.tax_application !== undefined) updateData.tax_application = data.tax_application;
      if (data.number !== undefined) updateData.number = data.number;
      
      // Si no hay datos para actualizar, salimos
      if (Object.keys(updateData).length === 0) {
        return false;
      }
      
      updateData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('bills')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Factura actualizada con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al actualizar factura: ${error.message}`);
      console.error('Error updating bill:', error);
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

  const updateBillTransfers = useCallback(async (billId: string, addedTransferIds: string[], removedTransferIds: string[]) => {
    try {
      // Get the current bill
      const bill = await getBill(billId);
      if (!bill) throw new Error('Factura no encontrada');

      // 1. First remove transfers that need to be removed
      if (removedTransferIds.length > 0) {
        // Delete the bill_items entries
        const { error: removeItemsError } = await supabase
          .from('bill_items')
          .delete()
          .eq('bill_id', billId)
          .in('transfer_id', removedTransferIds);

        if (removeItemsError) throw removeItemsError;

        // Mark transfers as unbilled
        for (const transferId of removedTransferIds) {
          await updateTransfer(transferId, { billed: false });
        }
      }

      // 2. Add new transfers
      if (addedTransferIds.length > 0) {
        const billItems = [];
        let additionalSubtotal = 0;
        
        // Process each transfer to add
        for (const transferId of addedTransferIds) {
          const transfer = await getTransfer(transferId);
          if (!transfer) continue;

          // Add to bill items
          billItems.push({
            bill_id: billId,
            transfer_id: transferId,
            description: `Transfer desde ${transfer.origin} hasta ${transfer.destination} el ${transfer.date}`,
            quantity: 1,
            unit_price: transfer.price,
            total_price: transfer.price,
          });
          
          // Add to subtotal
          additionalSubtotal += transfer.price;
          
          // Mark as billed
          await updateTransfer(transferId, { billed: true });
        }
        
        // Insert the new bill items
        if (billItems.length > 0) {
          const { error: addItemsError } = await supabase
            .from('bill_items')
            .insert(billItems);

          if (addItemsError) throw addItemsError;
        }
        
        // Recalculate bill totals
        const newSubTotal = bill.sub_total + additionalSubtotal;
        let newTaxAmount;
        let newTotal;
        
        if (bill.tax_application === 'included') {
          newTaxAmount = (newSubTotal * bill.tax_rate) / (100 + bill.tax_rate);
          newTotal = newSubTotal;
        } else {
          newTaxAmount = (newSubTotal * bill.tax_rate) / 100;
          newTotal = newSubTotal + newTaxAmount;
        }
        
        // Update bill with new totals
        const { error: updateBillError } = await supabase
          .from('bills')
          .update({
            sub_total: newSubTotal,
            tax_amount: newTaxAmount,
            total: newTotal,
            updated_at: new Date().toISOString()
          })
          .eq('id', billId);
          
        if (updateBillError) throw updateBillError;
      }
      
      // Recalculate bill totals if there were removals but no additions
      if (removedTransferIds.length > 0 && addedTransferIds.length === 0) {
        // Fetch all remaining items
        const { data: remainingItems, error: itemsError } = await supabase
          .from('bill_items')
          .select('*')
          .eq('bill_id', billId);
          
        if (itemsError) throw itemsError;
        
        // Calculate new subtotal
        const newSubTotal = (remainingItems || []).reduce((sum, item) => sum + item.total_price, 0);
        let newTaxAmount;
        let newTotal;
        
        if (bill.tax_application === 'included') {
          newTaxAmount = (newSubTotal * bill.tax_rate) / (100 + bill.tax_rate);
          newTotal = newSubTotal;
        } else {
          newTaxAmount = (newSubTotal * bill.tax_rate) / 100;
          newTotal = newSubTotal + newTaxAmount;
        }
        
        // Update bill with new totals
        const { error: updateBillError } = await supabase
          .from('bills')
          .update({
            sub_total: newSubTotal,
            tax_amount: newTaxAmount,
            total: newTotal,
            updated_at: new Date().toISOString()
          })
          .eq('id', billId);
          
        if (updateBillError) throw updateBillError;
      }
      
      toast.success('Transfers de la factura actualizados con éxito');
      return true;
    } catch (error: any) {
      toast.error(`Error al actualizar transfers de la factura: ${error.message}`);
      console.error('Error updating bill transfers:', error);
      return false;
    }
  }, [getBill, getTransfer, updateTransfer]);

  return {
    bills,
    loading,
    fetchBills,
    getBill,
    calculateBillPreview,
    createBill,
    updateBill,
    updateBillStatus,
    deleteBill,
    exportBillCsv,
    printBill,
    updateBillTransfers
  };
}
