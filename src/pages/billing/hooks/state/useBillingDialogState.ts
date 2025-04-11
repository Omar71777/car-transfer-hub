
import { useState } from 'react';
import { Bill } from '@/types/billing';

export function useBillingDialogState() {
  // Dialog visibility states
  const [activeTab, setActiveTab] = useState('bills');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Bill selection states
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [viewBill, setViewBill] = useState<Bill | null>(null);
  
  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  const resetDialogStates = () => {
    // First, ensure any open dialogs are closed
    if (isFormDialogOpen) setIsFormDialogOpen(false);
    if (isViewDialogOpen) setIsViewDialogOpen(false); 
    if (isEditDialogOpen) setIsEditDialogOpen(false);
    if (isDeleteDialogOpen) setIsDeleteDialogOpen(false);
    
    // Wait a tick to ensure dialogs have a chance to properly close
    // before resetting bill states (prevents flashing content)
    setTimeout(() => {
      setSelectedBill(null);
      // Don't reset viewBill as it might be needed for the next operation
      setError(null);
    }, 50);
  };

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Dialog visibility
    isFormDialogOpen,
    setIsFormDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    
    // Bill selection
    selectedBill,
    setSelectedBill,
    viewBill,
    setViewBill,
    
    // Loading states
    isCreating,
    setIsCreating,
    isLoading,
    setIsLoading,
    
    // Error state
    error,
    setError,
    
    // Utility functions
    resetDialogStates
  };
}
