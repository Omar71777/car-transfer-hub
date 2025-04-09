
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransfersTable } from '@/components/transfers/TransfersTable';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Transfer } from '@/types';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateId } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Datos de ejemplo (simulando lo que vendría de Firebase)
const dummyTransfers: Transfer[] = [
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
  },
  {
    id: '3',
    date: '2025-04-10',
    time: '11:15',
    origin: 'Puerto de Ibiza',
    destination: 'Cala Comte',
    price: 120,
    collaborator: 'Juan Pérez',
    commission: 10,
    expenses: []
  }
];

const TransfersPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>(dummyTransfers);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditTransfer = (transfer: Transfer) => {
    // En un caso real, esto redireccionaría a la página de edición
    console.log('Editar transfer:', transfer);
  };

  const handleDeleteTransfer = (id: string) => {
    setTransfers(transfers.filter(transfer => transfer.id !== id));
    toast({
      title: "Transfer eliminado",
      description: "El transfer ha sido eliminado exitosamente.",
    });
  };

  const handleAddExpense = (transferId: string) => {
    setSelectedTransferId(transferId);
    setIsExpenseDialogOpen(true);
  };

  const handleExpenseSubmit = (values: any) => {
    const newExpense = {
      id: generateId(),
      transferId: selectedTransferId || '',
      date: values.date,
      concept: values.concept,
      amount: values.amount
    };

    setTransfers(prevTransfers => 
      prevTransfers.map(transfer => 
        transfer.id === selectedTransferId 
          ? { ...transfer, expenses: [...transfer.expenses, newExpense] } 
          : transfer
      )
    );

    setIsExpenseDialogOpen(false);
    toast({
      title: "Gasto añadido",
      description: "El gasto ha sido añadido al transfer exitosamente.",
    });
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-ibiza-900">Transfers</h1>
            <p className="text-muted-foreground">Gestiona todos tus servicios de transfer</p>
          </div>
          <Button asChild>
            <Link to="/transfers/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Transfer
            </Link>
          </Button>
        </div>

        <TransfersTable 
          transfers={transfers} 
          onEdit={handleEditTransfer} 
          onDelete={handleDeleteTransfer}
          onAddExpense={handleAddExpense}
        />

        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Gasto al Transfer</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSubmit={handleExpenseSubmit} transferId={selectedTransferId || ''} />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TransfersPage;
