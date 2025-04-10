
import { useState, useCallback } from 'react';
import { Transfer } from '@/types';
import { fetchAllTransfers, fetchTransferById } from './fetch';

export function useFetchTransfers(user: any) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchAllTransfers(user);
      setTransfers(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { 
    transfers, 
    loading, 
    fetchTransfers,
    setTransfers
  };
}
