
import { useCallback } from 'react';
import { toast } from 'sonner';
import { CreateBillDto } from '@/types/billing';
import { useBillPreview } from './useBillPreview';
import { useBillNumber } from './useBillNumber';
import { createBillRecord } from './bill-creation/createBillRecord';
import { prepareBillItems } from './bill-creation/prepareBillItems';
import { saveBillItems } from './bill-creation/saveBillItems';
import { markTransfersBilled } from './bill-creation/markTransfersBilled';

export function useCreateBill(
  getClient: (id: string) => Promise<any>,
  getTransfer: (id: string) => Promise<any>,
  updateTransfer: (id: string, data: any) => Promise<boolean>
) {
  const { calculateBillPreview } = useBillPreview(getClient, getTransfer);
  const { generateBillNumber } = useBillNumber();

  const createBill = useCallback(async (billData: CreateBillDto) => {
    try {
      console.log('Starting bill creation with', {
        client: billData.clientId,
        transfersCount: billData.transferIds.length,
        taxRate: billData.taxRate,
        taxApp: billData.taxApplication,
      });

      // Validate required data
      if (!billData.clientId || !billData.transferIds.length) {
        console.error('Missing required bill data', billData);
        throw new Error('Datos incompletos para crear factura');
      }

      // Calculate bill preview
      const preview = await calculateBillPreview(
        billData.clientId,
        billData.transferIds,
        billData.taxRate,
        billData.taxApplication
      );
      
      if (!preview) {
        console.error('Failed to calculate bill preview');
        throw new Error('No se pudo calcular la vista previa de la factura');
      }
      
      // Generate bill number
      const billNumber = await generateBillNumber();
      
      // 1. Create the bill record
      const bill = await createBillRecord(
        billData.clientId,
        billNumber,
        billData.date,
        billData.dueDate,
        preview,
        billData.taxRate,
        billData.taxApplication,
        billData.notes
      );
      
      // 2. Prepare bill items for insertion
      const billItems = prepareBillItems(bill.id, preview);
      
      // 3. Save bill items
      await saveBillItems(billItems);
      
      // 4. Mark transfers as billed
      const transferIds = preview.items.map(item => item.transfer.id).filter(Boolean);
      await markTransfersBilled(transferIds, updateTransfer);
      
      toast.success('Factura creada con éxito');
      return bill.id;
    } catch (error: any) {
      toast.error(`Error al crear factura: ${error.message}`);
      console.error('Error creating bill:', error);
      return null;
    }
  }, [calculateBillPreview, generateBillNumber, updateTransfer]);

  return { createBill };
}
