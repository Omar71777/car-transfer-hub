
import { fetchTransferById } from '../fetch/fetchTransferById';
import { Transfer } from '@/types';

export async function getTransfer(id: string): Promise<Transfer | null> {
  if (!id) return null;
  return fetchTransferById(id);
}
