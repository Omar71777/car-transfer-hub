
import { useState, useEffect } from 'react';
import { Transfer, Expense } from '@/types';
import { useCollaborators } from '@/hooks/useCollaborators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '@/lib/utils';

// Load profits data from Supabase
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

  // Load data from Supabase
  useEffect(() => {
    const loadProfitsData = async () => {
      setLoading(true);
      
      try {
        // Load transfers from Supabase
        const { data: transfersData, error: transfersError } = await supabase
          .from('transfers')
          .select(`
            id,
            date,
            time,
            origin,
            destination,
            price,
            collaborator,
            commission,
            payment_status
          `)
          .order('date', { ascending: false });

        if (transfersError) {
          throw transfersError;
        }

        // Load expenses from Supabase
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (expensesError) {
          throw expensesError;
        }

        // Transform the transfers data to match our Transfer type
        const processedTransfers = transfersData.map((transfer: any) => ({
          id: transfer.id,
          date: transfer.date,
          time: transfer.time || '',
          origin: capitalizeFirstLetter(transfer.origin),
          destination: capitalizeFirstLetter(transfer.destination),
          price: Number(transfer.price),
          collaborator: transfer.collaborator ? capitalizeFirstLetter(transfer.collaborator) : '',
          commission: Number(transfer.commission),
          commissionType: 'percentage' as const, // Use "as const" to satisfy TypeScript's type requirement
          paymentStatus: transfer.payment_status || 'pending', 
          expenses: []
        }));

        // Transform the expenses data to match our Expense type
        const processedExpenses = expensesData.map((expense: any) => ({
          id: expense.id,
          transferId: expense.transfer_id || '',
          date: expense.date,
          concept: capitalizeFirstLetter(expense.concept),
          amount: Number(expense.amount)
        }));

        // Assign expenses to their respective transfers
        processedTransfers.forEach(transfer => {
          transfer.expenses = processedExpenses.filter(expense => 
            expense.transferId === transfer.id
          );
        });

        setTransfers(processedTransfers);
        setExpenses(processedExpenses);

        // Get collaborator names from the collaborators list instead of transfers
        const collaboratorNames = collaborators.map(c => capitalizeFirstLetter(c.name)) as string[];
        setUniqueCollaborators(collaboratorNames);

        // Extract unique expense types
        const expenseTypes = [...new Set(processedExpenses.map((e: Expense) => e.concept))] as string[];
        setUniqueExpenseTypes(expenseTypes);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(`Error al cargar los datos: ${error.message}`);
      } finally {
        setLoading(false);
      }
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
