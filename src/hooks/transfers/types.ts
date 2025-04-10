
import { Transfer } from '@/types';

export interface UseTransfersResult {
  transfers: Transfer[];
  loading: boolean;
  fetchTransfers: () => Promise<void>;
  createTransfer: (transferData: any) => Promise<string | null>;
  updateTransfer: (id: string, transferData: Partial<Transfer>) => Promise<boolean>;
  deleteTransfer: (id: string) => Promise<boolean>;
  getTransfer: (id: string) => Promise<any>;
}
