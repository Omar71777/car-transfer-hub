
import { Transfer, Expense } from '@/types';

export interface UseTransfersResult {
  transfers: Transfer[];
  expenses: Expense[];
  loading: boolean;
  fetchTransfers: () => Promise<void>;
  fetchTransfersInRange: (startDate: string, endDate: string) => Promise<Transfer[]>;
  fetchTransferById: (id: string) => Promise<any>;
  createTransfer: (transferData: any) => Promise<string | null>;
  updateTransfer: (id: string, transferData: Partial<Transfer>) => Promise<boolean>;
  deleteTransfer: (id: string) => Promise<boolean>;
  getTransfer: (id: string) => Promise<any>;
}
