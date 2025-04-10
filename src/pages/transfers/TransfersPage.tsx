
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransfersTable } from '@/components/transfers/TransfersTable';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Transfer } from '@/types';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TransferForm } from '@/components/transfers/TransferForm';
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useIsMobile } from '@/hooks/use-mobile';

const TransfersPage = () => {
  const {
    transfers,
    loading,
    fetchTransfers,
    updateTransfer,
    deleteTransfer
  } = useTransfers();
  const {
    createExpense
  } = useExpenses();
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);
  
  const handleEditTransfer = (transfer: Transfer) => {
    setEditingTransfer(transfer);
    setIsEditDialogOpen(true);
  };
  
  const handleEditSubmit = async (values: any) => {
    if (!editingTransfer) return;
    const success = await updateTransfer(editingTransfer.id, values);
    if (success) {
      setIsEditDialogOpen(false);
      toast.success("Transfer actualizado");
      fetchTransfers();
    }
  };
  
  const handleDeleteTransfer = async (id: string) => {
    const success = await deleteTransfer(id);
    if (success) {
      toast.success("Transfer eliminado");
      fetchTransfers();
    }
  };
  
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
  
  return (
    <MainLayout>
      <div className="py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 px-2 md:px-0">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-ibiza-900 text-left">Transfers</h1>
            <p className="text-muted-foreground text-left text-sm md:text-base">Gestiona todos tus servicios de transfer</p>
          </div>
          <Button asChild className="self-stretch md:self-auto">
            <Link to="/transfers/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Transfer
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Cargando transfers...</p>
          </div>
        ) : (
          <TransfersTable 
            transfers={transfers} 
            onEdit={handleEditTransfer} 
            onDelete={handleDeleteTransfer} 
            onAddExpense={handleAddExpense} 
          />
        )}

        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogContent className={isMobile ? "max-w-[95vw] p-4 rounded-lg" : ""}>
            <DialogHeader>
              <DialogTitle>Añadir Gasto al Transfer</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSubmit={handleExpenseSubmit} transferId={selectedTransferId || ''} />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className={isMobile ? "max-w-[95vw] p-4 rounded-lg" : "sm:max-w-[600px]"}>
            <DialogHeader>
              <DialogTitle>Editar Transfer</DialogTitle>
            </DialogHeader>
            {editingTransfer && (
              <TransferForm 
                onSubmit={handleEditSubmit} 
                initialValues={editingTransfer} 
                isEditing={true} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TransfersPage;
