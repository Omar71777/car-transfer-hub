
import { useBillPreview } from './useBillPreview';
import { useBillNumber } from './useBillNumber';
import { useCreateBill } from './useCreateBill';

export function useBillGeneration(
  getClient: (id: string) => Promise<any>,
  getTransfer: (id: string) => Promise<any>,
  updateTransfer: (id: string, data: any) => Promise<boolean>
) {
  const { calculateBillPreview } = useBillPreview(getClient, getTransfer);
  const { generateBillNumber } = useBillNumber();
  const { createBill } = useCreateBill(getClient, getTransfer, updateTransfer);

  return {
    calculateBillPreview,
    generateBillNumber,
    createBill
  };
}
