
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types';
import { useAuth } from '@/contexts/auth';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use 'from' instead of directly accessing the table name
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Expense type
      const transformedData = data.map((expense: any) => ({
        id: expense.id,
        transferId: expense.transfer_id || '',
        date: expense.date,
        concept: expense.concept,
        amount: Number(expense.amount)
      }));

      setExpenses(transformedData);
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast.error(`Error al cargar los gastos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add useEffect to load expenses when the hook is initialized
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = useCallback(async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) return null;
    
    try {
      // Use 'from' instead of directly accessing the table name
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          transfer_id: expenseData.transferId || null,
          date: expenseData.date,
          concept: expenseData.concept,
          amount: expenseData.amount
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      return data.id as string;
    } catch (error: any) {
      console.error('Error creating expense:', error);
      toast.error(`Error al crear el gasto: ${error.message}`);
      return null;
    }
  }, [user]);

  const updateExpense = useCallback(async (id: string, expenseData: Partial<Expense>) => {
    if (!user) return false;
    
    try {
      // Use 'from' instead of directly accessing the table name
      const { error } = await supabase
        .from('expenses')
        .update({
          transfer_id: expenseData.transferId || null,
          date: expenseData.date,
          concept: expenseData.concept,
          amount: expenseData.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast.error(`Error al actualizar el gasto: ${error.message}`);
      return false;
    }
  }, [user]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!user) return false;
    
    try {
      // Use 'from' instead of directly accessing the table name
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast.error(`Error al eliminar el gasto: ${error.message}`);
      return false;
    }
  }, [user]);

  return {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
}
