
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useAuth } from '@/contexts/auth';
import { useTransferDialogs } from './hooks/useTransferDialogs';
import { TransferManagementTab } from './components/TransferManagementTab';
import { TransferReportsTab } from './components/TransferReportsTab';
import { TransferDialogs } from './components/TransferDialogs';
import { handleExportCSV, generateReportStats } from './helpers/reportHelpers';
import { printProfitReport } from '@/lib/exports';
import { TransferSummaryDialog } from '@/components/transfers/TransferSummaryDialog';
import { Transfer } from '@/types';

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

  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryTransferId, setSummaryTransferId] = useState<string | null>(null);
  
  // Global cleanup for pointer events issues
  useEffect(() => {
    // Ensure pointer-events are always enabled when component mounts
    document.body.style.pointerEvents = 'auto';
    
    // Create a MutationObserver to watch for style changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const bodyStyle = document.body.style;
          if (bodyStyle.pointerEvents === 'none') {
            // Fix it after a short delay to allow other code to finish
            setTimeout(() => {
              document.body.style.pointerEvents = 'auto';
            }, 100);
          }
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    
    // Clean up
    return () => {
      observer.disconnect();
      document.body.style.pointerEvents = 'auto';
    };
  }, []);
  
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);
  
  // Reset state when dialogs close
  useEffect(() => {
    if (!isEditDialogOpen && !isExpenseDialogOpen && !isSummaryDialogOpen) {
      // Give time for animations to complete before clearing state
      const timeout = setTimeout(() => {
        if (!isEditDialogOpen && !isExpenseDialogOpen && !isSummaryDialogOpen) {
          // No need to clear summaryTransferId if the summary dialog is still open
          if (!isSummaryDialogOpen) {
            setSummaryTransferId(null);
          }
        }
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isEditDialogOpen, isExpenseDialogOpen, isSummaryDialogOpen]);
  
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
  
  const handleDeleteMultipleTransfers = async (ids: string[]) => {
    let successCount = 0;
    
    for (const id of ids) {
      const success = await deleteTransfer(id);
      if (success) successCount++;
    }
    
    if (successCount === ids.length) {
      toast.success(`${successCount} transfers eliminados correctamente`);
    } else if (successCount > 0) {
      toast.warning(`${successCount} de ${ids.length} transfers eliminados. Algunos no pudieron ser eliminados.`);
    } else {
      toast.error("No se pudo eliminar ningún transfer");
    }
    
    fetchTransfers();
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

  const handleViewSummary = (transferId: string) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setSummaryTransferId(transferId);
    setIsSummaryDialogOpen(true);
  };

  const handleCloseSummary = () => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsSummaryDialogOpen(false);
    // We'll let the useEffect handle clearing summaryTransferId after animation completes
  };

  const handlePrint = () => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    const stats = generateReportStats(transfers, expenses);
    
    printProfitReport('Informe de Transfers', transfers, expenses, stats, {
      name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
      email: profile?.email || ''
    });
    
    // Restore pointer events after a short delay
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 100);
  };
  
  return (
    <MainLayout>
      <div className="py-4 md:py-6 w-full">
        <Tabs defaultValue="manage" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto mb-4">
            <TabsTrigger value="manage" className="flex-1 sm:flex-initial">Gestión de Transfers</TabsTrigger>
            <TabsTrigger value="report" className="flex-1 sm:flex-initial">Informes y Análisis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="w-full">
            <TransferManagementTab 
              transfers={transfers}
              loading={loading}
              onEdit={handleEditTransfer}
              onDelete={handleDeleteTransfer}
              onAddExpense={handleAddExpense}
              onViewSummary={handleViewSummary}
              onDeleteMultiple={handleDeleteMultipleTransfers}
            />
          </TabsContent>
          
          <TabsContent value="report" className="w-full">
            <TransferReportsTab
              transfers={transfers}
              expenses={expenses}
              loading={loading}
              onExportCSV={() => handleExportCSV(transfers)}
              onPrint={handlePrint}
            />
          </TabsContent>
        </Tabs>

        {/* Only render dialogs when needed */}
        {(isExpenseDialogOpen || isEditDialogOpen) && (
          <TransferDialogs
            isExpenseDialogOpen={isExpenseDialogOpen}
            setIsExpenseDialogOpen={setIsExpenseDialogOpen}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            selectedTransferId={selectedTransferId}
            editingTransfer={editingTransfer}
            onExpenseSubmit={handleExpenseSubmit}
            onEditSubmit={handleEditSubmit}
          />
        )}

        {summaryTransferId && (
          <TransferSummaryDialog
            isOpen={isSummaryDialogOpen}
            onClose={handleCloseSummary}
            transferId={summaryTransferId}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default TransfersPage;
