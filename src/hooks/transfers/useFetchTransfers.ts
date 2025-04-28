
import { useState, useCallback } from 'react';
import { Transfer, Expense } from '@/types';
import { fetchAllTransfers } from './fetch';

export function useFetchTransfers(user: any) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchAllTransfers(user);
      setTransfers(data);
      
      // Extract expenses from transfers
      const allExpenses = data.flatMap(transfer => 
        transfer.expenses.map(expense => ({
          ...expense,
          transferId: transfer.id
        }))
      );
      
      setExpenses(allExpenses);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchTransfersInRange = useCallback(async (startDate: string, endDate: string) => {
    if (!user) return [];
    
    try {
      setLoading(true);
      const data = await fetchAllTransfers(user);
      
      // Filter transfers by date range
      const filteredTransfers = data.filter(transfer => {
        return transfer.date >= startDate && transfer.date <= endDate;
      });
      
      return filteredTransfers;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchTransferByIdFunc = useCallback(async (id: string) => {
    return fetchAllTransfers(user)
      .then(transfers => transfers.find(transfer => transfer.id === id) || null);
  }, [user]);

  return { 
    transfers, 
    expenses,
    loading, 
    fetchTransfers,
    fetchTransfersInRange,
    fetchTransferById: fetchTransferByIdFunc,
    setTransfers
  };
}
