
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types';
import { useAuth } from '@/contexts/auth';
import { capitalizeFirstLetter } from '@/lib/utils';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Fetch expenses with order by date descending
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Expense type and ensure consistent formatting
      const transformedData = data.map((expense: any) => ({
        id: expense.id,
        transferId: expense.transfer_id || '',
        date: expense.date,
        concept: capitalizeFirstLetter(expense.concept || 'Sin categoría'),
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
      // Format the concept with capitalized first letter
      const formattedConcept = capitalizeFirstLetter(expenseData.concept);
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          transfer_id: expenseData.transferId || null,
          date: expenseData.date,
          concept: formattedConcept,
          amount: expenseData.amount
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Refresh the expense list
      await fetchExpenses();
      
      return data.id as string;
    } catch (error: any) {
      console.error('Error creating expense:', error);
      toast.error(`Error al crear el gasto: ${error.message}`);
      return null;
    }
  }, [user, fetchExpenses]);

  const updateExpense = useCallback(async (id: string, expenseData: Partial<Expense>) => {
    if (!user) return false;
    
    try {
      // Format the concept with capitalized first letter if provided
      const formattedConcept = expenseData.concept ? capitalizeFirstLetter(expenseData.concept) : undefined;
      
      const { error } = await supabase
        .from('expenses')
        .update({
          transfer_id: expenseData.transferId || null,
          date: expenseData.date,
          concept: formattedConcept,
          amount: expenseData.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh the expense list
      await fetchExpenses();
      
      return true;
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast.error(`Error al actualizar el gasto: ${error.message}`);
      return false;
    }
  }, [user, fetchExpenses]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh the expense list
      await fetchExpenses();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast.error(`Error al eliminar el gasto: ${error.message}`);
      return false;
    }
  }, [user, fetchExpenses]);

  // Add a function to get expense statistics
  const getExpenseStats = useCallback(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Get unique categories and their totals
    const categories = [...new Set(expenses.map(expense => expense.concept))];
    const categoryTotals = categories.map(category => {
      const categoryExpenses = expenses.filter(expense => expense.concept === category);
      const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        category,
        total: categoryTotal,
        percentage: (categoryTotal / total) * 100
      };
    }).sort((a, b) => b.total - a.total);
    
    return { total, categoryTotals };
  }, [expenses]);

  return {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats
  };
}
