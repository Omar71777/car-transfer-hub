
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransfersReportTable } from '@/components/reports/transfers/TransfersReportTable';
import { TransfersSummary } from '@/components/reports/transfers/TransfersSummary';
import { TransfersPageHeader } from '@/components/reports/transfers/TransfersPageHeader';
import { downloadCSV, printProfitReport } from '@/lib/exports';
import { useAuth } from '@/contexts/auth';

const TransfersPage = () => {
  const {
    transfers,
    loading,
    fetchTransfers,
    updateTransfer,
    deleteTransfer
  } = useTransfers();
  const {
    expenses,
    createExpense
  } = useExpenses();
  const {
    profile
  } = useAuth();
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  const [activeTab, setActiveTab] = useState('manage');
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

  // Report functions
  const handleExportCSV = () => {
    const data = transfers.map(transfer => ({
      Fecha: transfer.date,
      Hora: transfer.time || 'N/A',
      Origen: transfer.origin,
      Destino: transfer.destination,
      Precio: transfer.price,
      Colaborador: transfer.collaborator || 'N/A',
      Comisión: transfer.commission + '%',
      'Importe Comisión': (transfer.price * transfer.commission / 100).toFixed(2) + '€'
    }));
    downloadCSV(data, 'transfers-report.csv');
  };

  const handlePrint = () => {
    // Calculate total income from transfers
    const totalIncome = transfers.reduce((sum, t) => sum + t.price, 0);

    // Correctly calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate commissions
    const totalCommissions = transfers.reduce((sum, t) => sum + t.price * t.commission / 100, 0);

    // Calculate net profit: income - expenses - commissions
    const netProfit = totalIncome - totalExpenses - totalCommissions;

    // Calculate profit margin
    const profitMargin = totalIncome > 0 ? netProfit / totalIncome * 100 : 0;
    const stats = {
      totalIncome,
      totalExpenses,
      totalCommissions,
      netProfit,
      profitMargin
    };

    // Pass user information and ALL expenses
    printProfitReport('Informe de Transfers', transfers, expenses, stats, {
      name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
      email: profile?.email || ''
    });
  };
  
  return (
    <MainLayout>
      <div className="py-4 md:py-6">
        <Tabs defaultValue="manage" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 px-2 md:px-0">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-1 text-ibiza-900 text-left">Transfers</h1>
              <p className="text-muted-foreground text-left text-sm md:text-base">Gestiona y analiza todos tus servicios de transfer</p>
            </div>
            <div className="flex space-x-2">
              {activeTab === 'manage' && (
                <Button asChild className="self-stretch md:self-auto">
                  <Link to="/transfers/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Transfer
                  </Link>
                </Button>
              )}
              {activeTab === 'report' && (
                <TransfersPageHeader onExportCSV={handleExportCSV} onPrint={handlePrint} />
              )}
            </div>
          </div>

          <TabsList className="w-full sm:w-auto mb-4">
            <TabsTrigger value="manage" className="flex-1 sm:flex-initial">Gestión de Transfers</TabsTrigger>
            <TabsTrigger value="report" className="flex-1 sm:flex-initial">Informes y Análisis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
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
          </TabsContent>
          
          <TabsContent value="report">
            <Tabs defaultValue="table" className="w-full px-[9px]">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="table" className="flex-1 sm:flex-initial">Tabla de Transfers</TabsTrigger>
                <TabsTrigger value="summary" className="flex-1 sm:flex-initial">Resumen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Todos los Transfers</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 sm:px-6">
                    <TransfersReportTable transfers={transfers} loading={loading} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen de Transfers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransfersSummary transfers={transfers} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

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
