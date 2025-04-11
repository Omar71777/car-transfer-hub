
import { Bill, BillPreview, CreateBillDto, TaxApplicationType } from '@/types/billing';
import { Client } from '@/types/client';

export interface UseBillingResult {
  bills: Bill[];
  loading: boolean;
  fetchBills: () => Promise<void>;
  getBill: (id: string) => Promise<Bill | null>;
  calculateBillPreview: (
    clientId: string, 
    transferIds: string[], 
    taxRate: number, 
    taxApplication: TaxApplicationType
  ) => Promise<BillPreview | null>;
  createBill: (billData: CreateBillDto) => Promise<string | null>;
  updateBill: (id: string, data: Partial<Bill>) => Promise<boolean>;
  updateBillStatus: (id: string, status: Bill['status']) => Promise<boolean>;
  deleteBill: (id: string) => Promise<boolean>;
  exportBillCsv: (id: string) => Promise<boolean>;
  printBill: (id: string) => Promise<boolean>;
  updateBillTransfers: (
    billId: string, 
    addedTransferIds: string[], 
    removedTransferIds: string[]
  ) => Promise<boolean>;
}
