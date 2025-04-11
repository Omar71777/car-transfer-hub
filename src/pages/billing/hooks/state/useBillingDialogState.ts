
import { useState, useCallback } from 'react';
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

  // Create safe setters that ensure proper state transitions
  const safeSetIsFormDialogOpen = useCallback((open: boolean) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsFormDialogOpen(open);
  }, []);

  const safeSetIsViewDialogOpen = useCallback((open: boolean) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsViewDialogOpen(open);
  }, []);

  const safeSetIsEditDialogOpen = useCallback((open: boolean) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsEditDialogOpen(open);
  }, []);

  const safeSetIsDeleteDialogOpen = useCallback((open: boolean) => {
    // Ensure pointer events are enabled
    document.body.style.pointerEvents = 'auto';
    setIsDeleteDialogOpen(open);
  }, []);

  const resetDialogStates = useCallback(() => {
    // Only reset state for dialogs that are open
    // This prevents unnecessary state updates that might cause issues
    if (isFormDialogOpen) safeSetIsFormDialogOpen(false);
    if (isViewDialogOpen) safeSetIsViewDialogOpen(false); 
    if (isEditDialogOpen) safeSetIsEditDialogOpen(false);
    if (isDeleteDialogOpen) safeSetIsDeleteDialogOpen(false);
    
    // No longer waiting or using setTimeout to clear bill states
    // This avoids race conditions with React's state batching
    
    // Only clear selection if needed
    if (selectedBill !== null) setSelectedBill(null);
  }, [
    isFormDialogOpen, isViewDialogOpen, isEditDialogOpen, isDeleteDialogOpen,
    safeSetIsFormDialogOpen, safeSetIsViewDialogOpen, safeSetIsEditDialogOpen, safeSetIsDeleteDialogOpen,
    selectedBill
  ]);

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Dialog visibility
    isFormDialogOpen,
    setIsFormDialogOpen: safeSetIsFormDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen: safeSetIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen: safeSetIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen: safeSetIsDeleteDialogOpen,
    
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
