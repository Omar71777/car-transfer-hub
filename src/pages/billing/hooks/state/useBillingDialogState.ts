
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

  const resetDialogStates = () => {
    setIsFormDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedBill(null);
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
    
    // Utility functions
    resetDialogStates
  };
}
