import { useEffect, useRef } from 'react';

interface UseDialogManagementProps {
  isOpen: boolean;
  onClose?: () => void;
  preventTabTrap?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  finalFocusRef?: React.RefObject<HTMLElement>;
}

/**
 * Enhanced hook for dialog accessibility and management
 * Combines focus management, keyboard navigation, and accessibility features
 */
export function useDialogManagement({
  isOpen,
  onClose,
  preventTabTrap = false,
  initialFocusRef,
  finalFocusRef,
}: UseDialogManagementProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Save the active element when dialog opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);
  
  // Handle escape key to close dialog
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // Handle tab key to trap focus within dialog
  useEffect(() => {
    if (!isOpen || preventTabTrap) return;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // If shift+tab on first element, focus the last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If tab on last element, focus the first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, preventTabTrap]);
  
  // Focus first focusable element when dialog opens
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    
    // Use initialFocusRef if provided
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
      return;
    }
    
    const timer = setTimeout(() => {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isOpen, initialFocusRef]);
  
  // Return focus to previous element when dialog closes
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      // Use finalFocusRef if provided
      if (finalFocusRef?.current) {
        finalFocusRef.current.focus();
        return;
      }
      
      // Otherwise return to previous element
      const timer = setTimeout(() => {
        if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, finalFocusRef]);
  
  return { dialogRef, returnFocus: () => previousFocusRef.current?.focus() };
}
