
import { fetchTransferById } from '../fetch/fetchTransferById';

export async function getTransfer(id: string) {
  return fetchTransferById(id);
}
