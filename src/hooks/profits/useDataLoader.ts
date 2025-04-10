
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';

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

  // Load data from localStorage
  useEffect(() => {
    const loadProfitsData = () => {
      setLoading(true);
      
      // Load transfers from localStorage
      const storedTransfers = localStorage.getItem('transfers');
      const dummyTransfers = [
        {
          id: '1',
          date: '2025-04-09',
          time: '09:30',
          origin: 'Aeropuerto de Ibiza',
          destination: 'Hotel Ushuaïa',
          price: 85,
          collaborator: 'Carlos Sánchez',
          commission: 10,
          expenses: []
        },
        {
          id: '2',
          date: '2025-04-09',
          time: '14:45',
          origin: 'Hotel Pacha',
          destination: 'Playa d\'en Bossa',
          price: 65,
          collaborator: 'María López',
          commission: 15,
          expenses: []
        }
      ];
      const loadedTransfers = storedTransfers ? JSON.parse(storedTransfers) : dummyTransfers;
      setTransfers(loadedTransfers);

      // Extract unique collaborators
      const collaborators = [...new Set(loadedTransfers.map((t: Transfer) => t.collaborator))] as string[];
      setUniqueCollaborators(collaborators);

      // Load expenses from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      const dummyExpenses = [
        {
          id: '1',
          transferId: '1',
          date: '2025-04-09',
          concept: 'Combustible',
          amount: 45.50
        },
        {
          id: '2',
          transferId: '2',
          date: '2025-04-09',
          concept: 'Peaje',
          amount: 12.30
        }
      ];
      const loadedExpenses = storedExpenses ? JSON.parse(storedExpenses) : dummyExpenses;
      setExpenses(loadedExpenses);

      // Extract unique expense types
      const expenseTypes = [...new Set(loadedExpenses.map((e: Expense) => e.concept))] as string[];
      setUniqueExpenseTypes(expenseTypes);
      
      setLoading(false);
    };

    loadProfitsData();
  }, []); // Empty dependency array to run only once on mount

  return {
    transfers,
    expenses,
    loading,
    uniqueCollaborators,
    uniqueExpenseTypes
  };
};
