
import { useState } from 'react';
import { CreateBillDto } from '@/types/billing';
import { toast } from 'sonner';

export function useBillCreateHandler(
  createBill: (values: CreateBillDto) => Promise<string | null>,
  fetchBills: () => Promise<void>,
  setActiveTab: (tab: string) => void,
  setIsFormDialogOpen: (open: boolean) => void,
  setIsCreating: (creating: boolean) => void
) {
  const handleAddBill = () => {
    setIsFormDialogOpen(true);
  };

  const handleFormSubmit = async (values: CreateBillDto) => {
    setIsCreating(true);
    try {
      console.log('Creating bill with values:', values);
      const billId = await createBill(values);
      console.log('Bill creation result billId:', billId);
      
      // Always close the dialog and refresh the bills list
      setIsFormDialogOpen(false);
      await fetchBills();
      setActiveTab('bills');
      
      if (billId) {
        toast.success('Factura creada con éxito');
      } else {
        toast.error('Hubo un problema al crear la factura. Se creó sin items.');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Error al crear la factura');
      // Still close the dialog even on error
      setIsFormDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    handleAddBill,
    handleFormSubmit
  };
}
