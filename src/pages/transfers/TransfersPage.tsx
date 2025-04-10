
import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth';
import { useTransferDialogs } from './hooks/useTransferDialogs';
import { TransferManagementTab } from './components/TransferManagementTab';
import { TransferReportsTab } from './components/TransferReportsTab';
import { TransferDialogs } from './components/TransferDialogs';
import { handleExportCSV, generateReportStats } from './helpers/reportHelpers';
import { printProfitReport } from '@/lib/exports';

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
  
  const { profile } = useAuth();
  const isMobile = useIsMobile();
  
  const {
    selectedTransferId,
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingTransfer,
    activeTab,
    setActiveTab,
    handleEditTransfer,
    handleAddExpense
  } = useTransferDialogs();
  
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);
  
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

  const handlePrint = () => {
    const stats = generateReportStats(transfers, expenses);
    
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
          <TabsList className="w-full sm:w-auto mb-4">
            <TabsTrigger value="manage" className="flex-1 sm:flex-initial">Gestión de Transfers</TabsTrigger>
            <TabsTrigger value="report" className="flex-1 sm:flex-initial">Informes y Análisis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <TransferManagementTab 
              transfers={transfers}
              loading={loading}
              onEdit={handleEditTransfer}
              onDelete={handleDeleteTransfer}
              onAddExpense={handleAddExpense}
            />
          </TabsContent>
          
          <TabsContent value="report">
            <TransferReportsTab
              transfers={transfers}
              expenses={expenses}
              loading={loading}
              onExportCSV={() => handleExportCSV(transfers)}
              onPrint={handlePrint}
            />
          </TabsContent>
        </Tabs>

        <TransferDialogs
          isExpenseDialogOpen={isExpenseDialogOpen}
          setIsExpenseDialogOpen={setIsExpenseDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          selectedTransferId={selectedTransferId}
          editingTransfer={editingTransfer}
          onExpenseSubmit={handleExpenseSubmit}
          onEditSubmit={handleEditSubmit}
          isMobile={isMobile}
        />
      </div>
    </MainLayout>
  );
};

export default TransfersPage;
