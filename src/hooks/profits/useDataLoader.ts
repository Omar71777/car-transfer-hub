
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { useCollaborators } from '@/hooks/useCollaborators';

// Load profits data from storage
export const useDataLoader = (): {
  transfers: Transfer[];
  expenses: Expense[];
  loading: boolean;
  uniqueCollaborators: string[];
  uniqueExpenseTypes: string[];
} => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [uniqueCollaborators, setUniqueCollaborators] = useState<string[]>([]);
  const [uniqueExpenseTypes, setUniqueExpenseTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { collaborators } = useCollaborators();

  // Load data from localStorage
  useEffect(() => {
    const loadProfitsData = () => {
      setLoading(true);
      
      // Load transfers from localStorage
      const storedTransfers = localStorage.getItem('transfers');
      const loadedTransfers = storedTransfers ? JSON.parse(storedTransfers) : [];
      setTransfers(loadedTransfers);

      // Get collaborator names from the collaborators list instead of transfers
      const collaboratorNames = collaborators.map(c => c.name) as string[];
      setUniqueCollaborators(collaboratorNames);

      // Load expenses from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      const loadedExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      setExpenses(loadedExpenses);

      // Extract unique expense types
      const expenseTypes = [...new Set(loadedExpenses.map((e: Expense) => e.concept))] as string[];
      setUniqueExpenseTypes(expenseTypes);
      
      setLoading(false);
    };

    loadProfitsData();
  }, [collaborators]); // Rerun when collaborators change

  return {
    transfers,
    expenses,
    loading,
    uniqueCollaborators,
    uniqueExpenseTypes
  };
};
