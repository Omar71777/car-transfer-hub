
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTransfersPage } from './hooks/useTransfersPage';
import { TransfersPageContent } from './components/TransfersPageContent';
import { TransferDialogs } from './components/TransferDialogs';
import { TransferSummaryDialogContainer } from './components/TransferSummaryDialogContainer';

const TransfersPage = () => {
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
    handlePrint,
    handleExportTransfers
  } = useTransfersPage();
  
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
        onExportCSV={handleExportTransfers}
        onPrint={handlePrint}
      />

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

      <TransferSummaryDialogContainer
        isOpen={isSummaryDialogOpen}
        onClose={handleCloseSummary}
        transferId={summaryTransferId}
      />
    </MainLayout>
  );
};

export default TransfersPage;
