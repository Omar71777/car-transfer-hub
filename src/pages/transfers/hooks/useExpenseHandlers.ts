
import { useState } from 'react';
import { toast } from 'sonner';

export function useExpenseHandlers(
  createExpense: (data: any) => Promise<string | null>,
  fetchTransfers: () => Promise<void>,
  setIsExpenseDialogOpen: (open: boolean) => void
) {
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  
  const handleAddExpense = (transferId: string) => {
    setSelectedTransferId(transferId);
    setIsExpenseDialogOpen(true);
  };
  
  const handleExpenseSubmit = async (values: any) => {
    const expenseId = await createExpense({
      transferId: selectedTransferId || '',
      date: values.date,
      concept: values.concept,
      amount: parseFloat(values.amount)
    });
    
    if (expenseId) {
      setIsExpenseDialogOpen(false);
      toast.success("Gasto añadido al transfer");
      fetchTransfers();
    }
  };

  return {
    selectedTransferId,
    setSelectedTransferId,
    handleAddExpense,
    handleExpenseSubmit
  };
}
