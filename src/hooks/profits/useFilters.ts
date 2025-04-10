import { Transfer, Expense } from '@/types';
import { Filters } from './types';
import { isWithinInterval, parseISO, isValid } from 'date-fns';

// Apply filters to transfers and expenses
export const applyFilters = (
  transfers: Transfer[], 
  expenses: Expense[], 
  currentFilters: Filters
): { filteredTransfers: Transfer[], filteredExpenses: Expense[] } => {
  let filteredT = [...transfers];
  let filteredE = [...expenses];

  // Filter by date range
  if (currentFilters.dateRange?.from && currentFilters.dateRange?.to) {
    filteredT = filteredT.filter(transfer => {
      const transferDate = parseISO(transfer.date);
      return isValid(transferDate) && isWithinInterval(transferDate, {
        start: currentFilters.dateRange!.from!,
        end: currentFilters.dateRange!.to!
      });
    });

    filteredE = filteredE.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isValid(expenseDate) && isWithinInterval(expenseDate, {
        start: currentFilters.dateRange!.from!,
        end: currentFilters.dateRange!.to!
      });
    });
  }

  // Filter by collaborator
  if (currentFilters.collaborator) {
    filteredT = filteredT.filter(transfer => 
      transfer.collaborator === currentFilters.collaborator
    );
    
    // Get transfer IDs from filtered transfers to filter expenses
    const transferIds = filteredT.map(t => t.id);
    filteredE = filteredE.filter(expense => transferIds.includes(expense.transferId));
  }

  // Filter by expense type
  if (currentFilters.expenseType) {
    filteredE = filteredE.filter(expense => 
      expense.concept === currentFilters.expenseType
    );
    
    // Keep only transfers that have expenses of the selected type
    const transferIdsWithExpenseType = filteredE.map(e => e.transferId);
    if (transferIdsWithExpenseType.length > 0) {
      filteredT = filteredT.filter(transfer => 
        transferIdsWithExpenseType.includes(transfer.id)
      );
    }
  }

  return { filteredTransfers: filteredT, filteredExpenses: filteredE };
};
