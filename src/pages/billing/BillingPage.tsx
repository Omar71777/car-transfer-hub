
import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BillingHeader } from './components/BillingHeader';
import { BillsTabs } from './components/BillsTabs';
import { BillDialogs } from './components/BillDialogs';
import { useBillingActions } from './hooks/useBillingActions';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BillingPage = () => {
  const { session, isLoading: authLoading } = useAuth();
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
    resetDialogStates,
    error
  } = useBillingActions();

  useEffect(() => {
    // Only fetch bills if the user is authenticated
    if (session) {
      fetchBills();
    }
    
    // Cleanup function to reset dialog states when component unmounts
    return () => {
      resetDialogStates();
    };
  }, [fetchBills, resetDialogStates, session]);

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <MainLayout>
        <div className="py-4 md:py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!authLoading && !session) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="py-4 md:py-6">
        <BillingHeader />
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. Por favor, intenta de nuevo o contacta con soporte si el problema persiste.
            </AlertDescription>
          </Alert>
        )}
        
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
