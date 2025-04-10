
import { fetchTransferById } from '../fetch/fetchTransferById';

export async function getTransfer(id: string) {
  if (!id) return null;
  return fetchTransferById(id);
}
