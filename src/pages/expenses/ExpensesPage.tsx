
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpensesCharts } from '@/components/expenses/ExpensesCharts';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Expense } from '@/types';
import { useExpenses } from '@/hooks/useExpenses';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const ExpensesPage = () => {
  const {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  } = useExpenses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (values: any) => {
    const expenseId = await createExpense({
      transferId: values.transferId || '',
      date: values.date,
      concept: values.concept,
      amount: parseFloat(values.amount)
    });
    if (expenseId) {
      setIsDialogOpen(false);
      await fetchExpenses();
      toast.success("Gasto registrado con éxito");
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const handleUpdateExpense = async (values: any) => {
    if (!currentExpense) return;
    const success = await updateExpense(currentExpense.id, {
      transferId: values.transferId || currentExpense.transferId,
      date: values.date,
      concept: values.concept,
      amount: parseFloat(values.amount)
    });
    if (success) {
      setIsDialogOpen(false);
      setCurrentExpense(null);
      await fetchExpenses();
      toast.success("Gasto actualizado con éxito");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const success = await deleteExpense(id);
    if (success) {
      await fetchExpenses();
      toast.success("Gasto eliminado con éxito");
    }
  };

  return (
    <MainLayout>
      <div className="py-4 md:py-6 px-2 md:px-4">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-ibiza-900 text-left">Gastos</h1>
            <p className="text-muted-foreground text-left text-sm">Gestiona todos los gastos relacionados con los transfers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nuevo Gasto</span>
                <span className="sm:hidden">Nuevo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="dialog-content">
              <DialogHeader>
                <DialogTitle>{currentExpense ? 'Editar Gasto' : 'Nuevo Gasto'}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] overflow-auto pr-4">
                <ExpenseForm 
                  onSubmit={currentExpense ? handleUpdateExpense : handleAddExpense} 
                  defaultValues={currentExpense ? {
                    ...currentExpense,
                    amount: currentExpense.amount.toString()
                  } : undefined} 
                  isEditing={!!currentExpense} 
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {/* Add the ExpensesCharts component */}
        <ExpensesCharts expenses={expenses} loading={loading} />

        {loading && !expenses.length ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Cargando gastos...</p>
          </div>
        ) : (
          <ExpensesTable 
            expenses={expenses} 
            onEdit={handleEditExpense} 
            onDelete={handleDeleteExpense} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ExpensesPage;
