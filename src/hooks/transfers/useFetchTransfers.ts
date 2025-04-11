
import { useState, useCallback, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { fetchAllTransfers, fetchTransferById } from './fetch';
import { toast } from 'sonner';

export function useFetchTransfers(user: any) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchTransfers = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setError('Usuario no autenticado');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching transfers...', { retry: retryCount });
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
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Error fetching transfers:', error);
      
      const errorMessage = error?.message || 'Error al cargar los datos';
      setError(errorMessage);
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying in ${retryDelay}ms...`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      } else if (retryCount === MAX_RETRIES) {
        toast.error('No se pudieron cargar los datos después de varios intentos');
      }
    } finally {
      setLoading(false);
    }
  }, [user, retryCount]);

  // Automatically retry when retry count changes
  useEffect(() => {
    if (retryCount > 0 && retryCount <= MAX_RETRIES) {
      fetchTransfers();
    }
  }, [retryCount, fetchTransfers]);

  // Initial fetch
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

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
    } catch (error: any) {
      console.error('Error fetching transfers in range:', error);
      toast.error(`Error al cargar transferencias: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchTransferByIdFunc = useCallback(async (id: string) => {
    try {
      return await fetchTransferById(id);
    } catch (error: any) {
      console.error('Error fetching transfer by ID:', error);
      toast.error(`Error al cargar la transferencia: ${error.message}`);
      return null;
    }
  }, []);

  return { 
    transfers, 
    expenses,
    loading, 
    error,
    fetchTransfers,
    fetchTransfersInRange,
    fetchTransferById: fetchTransferByIdFunc,
    setTransfers
  };
}
