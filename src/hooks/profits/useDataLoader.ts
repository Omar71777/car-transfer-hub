
import { useState, useEffect } from 'react';
import { Transfer, Expense, ExtraCharge } from '@/types';
import { useCollaborators } from '@/hooks/useCollaborators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { capitalizeFirstLetter } from '@/lib/utils';
import { adaptExtraCharges } from '@/lib/calculations';

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
        console.log('Loading profits data from Supabase...');
        
        // Load transfers from Supabase with all required fields
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
            commission_type,
            payment_status,
            service_type,
            client_id,
            hours,
            discount_type,
            discount_value
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

        // Fetch extra charges for all transfers
        const transferIds = transfersData.map((transfer: any) => transfer.id);
        let extraChargesMap: Record<string, ExtraCharge[]> = {};
        
        if (transferIds.length > 0) {
          const { data: extraChargesData, error: extraChargesError } = await supabase
            .from('extra_charges')
            .select('*')
            .in('transfer_id', transferIds);
            
          if (extraChargesError) {
            throw extraChargesError;
          }
          
          // Group extra charges by transfer ID
          if (extraChargesData) {
            extraChargesMap = extraChargesData.reduce((acc: Record<string, ExtraCharge[]>, charge: any) => {
              if (!acc[charge.transfer_id]) {
                acc[charge.transfer_id] = [];
              }
              
              acc[charge.transfer_id].push({
                id: charge.id,
                transferId: charge.transfer_id,
                name: capitalizeFirstLetter(charge.name),
                price: Number(charge.price)
              });
              
              return acc;
            }, {});
          }
        }

        // Transform the transfers data to match our Transfer type
        const processedTransfers = transfersData.map((transfer: any) => {
          // Handle potential undefined values
          const serviceType = transfer.service_type || 'transfer';
          const origin = transfer.origin ? capitalizeFirstLetter(transfer.origin) : '';
          const destination = transfer.destination ? capitalizeFirstLetter(transfer.destination) : '';
          const collaborator = transfer.collaborator ? capitalizeFirstLetter(transfer.collaborator) : '';
          
          return {
            id: transfer.id,
            date: transfer.date,
            time: transfer.time || '',
            serviceType: serviceType,
            origin: origin,
            destination: destination,
            hours: transfer.hours !== null ? transfer.hours : undefined,
            price: Number(transfer.price),
            discountType: transfer.discount_type as 'percentage' | 'fixed' | null,
            discountValue: Number(transfer.discount_value) || 0,
            collaborator: collaborator,
            commission: Number(transfer.commission) || 0,
            commissionType: transfer.commission_type || 'percentage',
            paymentStatus: transfer.payment_status || 'pending', 
            clientId: transfer.client_id || '',
            expenses: [], // Will be filled later
            extraCharges: extraChargesMap[transfer.id] || [],
            client: undefined,
            billed: false
          };
        });

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

        console.log('Loaded transfers with complete data:', processedTransfers.length);
        console.log('Sample transfer data:', processedTransfers.length > 0 ? {
          id: processedTransfers[0].id,
          price: processedTransfers[0].price,
          serviceType: processedTransfers[0].serviceType,
          hours: processedTransfers[0].hours,
          discountType: processedTransfers[0].discountType,
          discountValue: processedTransfers[0].discountValue,
          extraChargesCount: processedTransfers[0].extraCharges.length
        } : 'No transfers available');

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
