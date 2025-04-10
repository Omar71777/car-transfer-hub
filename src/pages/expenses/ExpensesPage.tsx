
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Expense, Transfer } from '@/types';
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  // Cargar expenses desde localStorage al montar el componente
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      setExpenses(dummyExpenses);
      localStorage.setItem('expenses', JSON.stringify(dummyExpenses));
    }
  }, []);

  // Guardar expenses en localStorage cada vez que cambian
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  // Función para agregar un nuevo gasto al transfer correspondiente
  const updateTransferWithExpense = (newExpense: Expense) => {
    const storedTransfers = localStorage.getItem('transfers');
    if (storedTransfers) {
      const transfers: Transfer[] = JSON.parse(storedTransfers);
      const updatedTransfers = transfers.map(transfer => 
        transfer.id === newExpense.transferId 
          ? { ...transfer, expenses: [...transfer.expenses, newExpense] } 
          : transfer
      );
      localStorage.setItem('transfers', JSON.stringify(updatedTransfers));
    }
  };

  const handleAddExpense = (values: any) => {
    const newExpense = {
      id: generateId(),
      transferId: values.transferId || '',
      date: values.date,
      concept: values.concept,
      amount: parseFloat(values.amount)
    };

    setExpenses([...expenses, newExpense]);
    
    // Si el gasto está asociado a un transfer, también actualizamos ese transfer
    if (newExpense.transferId) {
      updateTransferWithExpense(newExpense);
    }
    
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

    const updatedExpense = {
      ...currentExpense,
      date: values.date,
      concept: values.concept,
      amount: parseFloat(values.amount),
      transferId: values.transferId || currentExpense.transferId
    };

    setExpenses(expenses.map(expense => 
      expense.id === currentExpense.id 
        ? updatedExpense
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
    // Buscar el gasto para ver si está asociado a un transfer
    const expenseToDelete = expenses.find(expense => expense.id === id);
    
    // Eliminar gasto de la lista de gastos
    setExpenses(expenses.filter(expense => expense.id !== id));
    
    // Si el gasto está asociado a un transfer, también actualizamos ese transfer
    if (expenseToDelete && expenseToDelete.transferId) {
      const storedTransfers = localStorage.getItem('transfers');
      if (storedTransfers) {
        const transfers: Transfer[] = JSON.parse(storedTransfers);
        const updatedTransfers = transfers.map(transfer => 
          transfer.id === expenseToDelete.transferId 
            ? { ...transfer, expenses: transfer.expenses.filter(e => e.id !== id) } 
            : transfer
        );
        localStorage.setItem('transfers', JSON.stringify(updatedTransfers));
      }
    }
    
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
                defaultValues={currentExpense ? {
                  ...currentExpense,
                  amount: currentExpense.amount.toString()
                } : undefined}
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
