import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Expense } from '@/types';
import { useExpenses } from '@/hooks/useExpenses';
import { toast } from 'sonner'; // Add missing import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  return <MainLayout>
      <div className="py-6 px-[11px]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-ibiza-900 text-left">Gastos</h1>
            <p className="text-muted-foreground text-left text-sm">Gestiona todos los gastos relacionados con los transfers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-xs my-0 mx-[15px] py-[33px]">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Gasto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentExpense ? 'Editar Gasto' : 'Nuevo Gasto'}</DialogTitle>
              </DialogHeader>
              <ExpenseForm onSubmit={currentExpense ? handleUpdateExpense : handleAddExpense} defaultValues={currentExpense ? {
              ...currentExpense,
              amount: currentExpense.amount.toString()
            } : undefined} isEditing={!!currentExpense} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Cargando gastos...</p>
          </div> : <ExpensesTable expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />}
      </div>
    </MainLayout>;
};
export default ExpensesPage;