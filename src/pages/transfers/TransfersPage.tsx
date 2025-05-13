
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTransfersPage } from './hooks/useTransfersPage';
import { TransfersPageContent } from './components/TransfersPageContent';
import { TransferDialogs } from './components/TransferDialogs';
import { TransferSummaryDialogContainer } from './components/TransferSummaryDialogContainer';
import { useNavigate } from 'react-router-dom';

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
    isDeleteDialogOpen,
    transferToDelete,
    transfersToDelete,
    
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
    handlePrintWithOptions,
    handleMarkAsPaid,
    closeDeleteDialog,
    // Access the actual delete operations
    deleteTransfer,
    deleteMultipleTransfers
  } = useTransfersPage();
  
  const handleAddTransfer = () => {
    navigate('/transfers/new');
  };

  // Prepare confirm handlers that will be called when user confirms deletion
  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (transferToDelete) {
      return await deleteTransfer(transferToDelete);
    }
    return false;
  };

  const handleDeleteMultipleConfirm = async (): Promise<boolean> => {
    if (transfersToDelete.length > 0) {
      return await deleteMultipleTransfers(transfersToDelete);
    }
    return false;
  };
  
  return (
    <MainLayout>
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
        onMarkAsPaid={handleMarkAsPaid}
        onAddTransfer={handleAddTransfer}
      />

      {/* Always render TransferDialogs to maintain consistent hooks */}
      <TransferDialogs
        isExpenseDialogOpen={isExpenseDialogOpen}
        setIsExpenseDialogOpen={setIsExpenseDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isPrintDialogOpen={isPrintDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        transferToDelete={transferToDelete}
        transfersToDelete={transfersToDelete}
        onCloseDeleteDialog={closeDeleteDialog}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteMultipleConfirm={handleDeleteMultipleConfirm}
        onClosePrintDialog={handleClosePrintDialog}
        onPrintWithOptions={handlePrintWithOptions}
        selectedTransferId={selectedTransferId}
        editingTransfer={editingTransfer}
        onExpenseSubmit={handleExpenseSubmit}
        onEditSubmit={handleEditSubmit}
        transfers={transfers}
      />

      <TransferSummaryDialogContainer
        isOpen={isSummaryDialogOpen}
        onClose={handleCloseSummary}
        transferId={summaryTransferId}
      />
    </MainLayout>
  );
}

export default TransfersPage;
