
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Expense } from '@/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Datos de ejemplo (simulando lo que vendría de Firebase)
const dummyExpenses: Expense[] = [
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
  },
  {
    id: '3',
    transferId: '3',
    date: '2025-04-10',
    concept: 'Lavado de vehículo',
    amount: 25.00
  }
];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  const handleAddExpense = (values: any) => {
    const newExpense = {
      id: generateId(),
      transferId: values.transferId || '',
      date: values.date,
      concept: values.concept,
      amount: values.amount
    };

    setExpenses([...expenses, newExpense]);
    setIsDialogOpen(false);
    toast({
      title: "Gasto registrado",
      description: "El gasto ha sido registrado exitosamente.",
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const handleUpdateExpense = (values: any) => {
    if (!currentExpense) return;

    setExpenses(expenses.map(expense => 
      expense.id === currentExpense.id 
        ? { ...expense, ...values, amount: values.amount } 
        : expense
    ));
    
    setIsDialogOpen(false);
    setCurrentExpense(null);
    toast({
      title: "Gasto actualizado",
      description: "El gasto ha sido actualizado exitosamente.",
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Gasto eliminado",
      description: "El gasto ha sido eliminado exitosamente.",
    });
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-ibiza-900">Gastos</h1>
            <p className="text-muted-foreground">Gestiona todos los gastos relacionados con los transfers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Gasto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentExpense ? 'Editar Gasto' : 'Nuevo Gasto'}</DialogTitle>
              </DialogHeader>
              <ExpenseForm 
                onSubmit={currentExpense ? handleUpdateExpense : handleAddExpense} 
                defaultValues={currentExpense || undefined}
                isEditing={!!currentExpense}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ExpensesTable 
          expenses={expenses} 
          onEdit={handleEditExpense} 
          onDelete={handleDeleteExpense}
        />
      </div>
    </MainLayout>
  );
};

export default ExpensesPage;
