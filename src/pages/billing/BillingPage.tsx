
import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BillingHeader } from './components/BillingHeader';
import { BillsTabs } from './components/BillsTabs';
import { BillDialogs } from './components/BillDialogs';
import { useBillingActions } from './hooks/useBillingActions';

const BillingPage = () => {
  const {
    bills,
    loading,
    activeTab,
    setActiveTab,
    isFormDialogOpen,
    setIsFormDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedBill,
    viewBill,
    fetchBills,
    handleAddBill,
    handleViewBill,
    handleEditBill,
    handleDeleteBill,
    handlePrintBill,
    handleDownloadBill,
    handleFormSubmit,
    handleEditSubmit,
    handleConfirmDelete,
    handleStatusChange,
    resetDialogStates
  } = useBillingActions();

  useEffect(() => {
    fetchBills();
    
    // Cleanup function to reset dialog states when component unmounts
    return () => {
      resetDialogStates();
    };
  }, [fetchBills, resetDialogStates]);

  return (
    <MainLayout>
      <div className="py-4 md:py-6">
        <BillingHeader />
        
        <BillsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          bills={bills}
          loading={loading}
          handleAddBill={handleAddBill}
          handleViewBill={handleViewBill}
          handleEditBill={handleEditBill}
          handlePrintBill={handlePrintBill}
          handleDeleteBill={handleDeleteBill}
          handleFormSubmit={handleFormSubmit}
        />

        <BillDialogs
          isFormDialogOpen={isFormDialogOpen}
          setIsFormDialogOpen={setIsFormDialogOpen}
          isViewDialogOpen={isViewDialogOpen}
          setIsViewDialogOpen={setIsViewDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          selectedBill={selectedBill}
          viewBill={viewBill}
          handleEditBill={handleEditBill}
          handleFormSubmit={handleFormSubmit}
          handleEditSubmit={handleEditSubmit}
          handleConfirmDelete={handleConfirmDelete}
          handlePrintBill={handlePrintBill}
          handleDownloadBill={handleDownloadBill}
          handleStatusChange={handleStatusChange}
        />
      </div>
    </MainLayout>
  );
};

export default BillingPage;
