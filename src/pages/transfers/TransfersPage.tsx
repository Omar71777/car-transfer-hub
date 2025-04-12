
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTransfersPage } from './hooks/useTransfersPage';
import { TransfersPageContent } from './components/TransfersPageContent';
import { TransferDialogs } from './components/TransferDialogs';
import { TransferSummaryDialogContainer } from './components/TransferSummaryDialogContainer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileSidebar } from '@/components/layout/MobileSidebar';

const TransfersPage = () => {
  const navigate = useNavigate();
  
  const {
    // State
    transfers,
    expenses,
    loading,
    isExpenseDialogOpen,
    isEditDialogOpen,
    editingTransfer,
    isSummaryDialogOpen,
    summaryTransferId,
    isPrintDialogOpen,
    activeTab,
    selectedTransferId,
    
    // Actions
    setIsExpenseDialogOpen,
    setIsEditDialogOpen,
    setActiveTab,
    handleEditTransfer,
    handleAddExpense,
    handleViewSummary,
    handleCloseSummary,
    handleEditSubmit,
    handleDeleteTransfer,
    handleDeleteMultipleTransfers,
    handleExpenseSubmit,
    handleClosePrintDialog,
    handlePrintWithOptions
  } = useTransfersPage();
  
  const handleAddTransfer = () => {
    navigate('/transfers/new');
  };
  
  const headerActions = (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleAddTransfer}
      aria-label="Add new transfer"
    >
      <Plus className="h-5 w-5" />
    </Button>
  );
  
  return (
    <MainLayout>
      <MobileSidebar />
      
      <TransfersPageContent
        transfers={transfers}
        expenses={expenses}
        loading={loading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEdit={handleEditTransfer}
        onDelete={handleDeleteTransfer}
        onAddExpense={handleAddExpense}
        onViewSummary={handleViewSummary}
        onDeleteMultiple={handleDeleteMultipleTransfers}
      />

      {/* Only render dialogs when needed */}
      {(isExpenseDialogOpen || isEditDialogOpen || isPrintDialogOpen) && (
        <TransferDialogs
          isExpenseDialogOpen={isExpenseDialogOpen}
          setIsExpenseDialogOpen={setIsExpenseDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isPrintDialogOpen={isPrintDialogOpen}
          onClosePrintDialog={handleClosePrintDialog}
          onPrintWithOptions={handlePrintWithOptions}
          selectedTransferId={selectedTransferId}
          editingTransfer={editingTransfer}
          onExpenseSubmit={handleExpenseSubmit}
          onEditSubmit={handleEditSubmit}
          transfers={transfers}
        />
      )}

      <TransferSummaryDialogContainer
        isOpen={isSummaryDialogOpen}
        onClose={handleCloseSummary}
        transferId={summaryTransferId}
      />
    </MainLayout>
  );
}

export default TransfersPage;
