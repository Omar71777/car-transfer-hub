
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
  const focusAttempts = useRef(0);
  const maxFocusAttempts = 5;
  
  // Save the active element when dialog opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Reset focus attempts counter
      focusAttempts.current = 0;
    }
  }, [isOpen]);
  
  // Handle escape key to close dialog
  useEffect(() => {
    if (!isOpen || !onClose) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // Force pointer events to be enabled before closing dialog
        document.body.style.pointerEvents = 'auto';
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
      
      // Force pointer events to be enabled when tabbing
      document.body.style.pointerEvents = 'auto';
      
      // Use more comprehensive selector for focusable elements
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"]), a[href], details, summary, iframe, object, embed, [contenteditable="true"]'
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
      const attemptInitialFocus = () => {
        if (focusAttempts.current >= maxFocusAttempts) return;
        
        try {
          initialFocusRef.current?.focus();
          focusAttempts.current = 0; // Reset on success
        } catch (error) {
          console.warn('Failed to focus initial element, retrying...', error);
          focusAttempts.current++;
          setTimeout(attemptInitialFocus, 50);
        }
      };
      
      attemptInitialFocus();
      return;
    }
    
    // If no initialFocusRef, find first focusable element
    const attemptFocus = () => {
      if (focusAttempts.current >= maxFocusAttempts) return;
      
      try {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"]), a[href]'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
          focusAttempts.current = 0; // Reset on success
        }
      } catch (error) {
        console.warn('Failed to focus first focusable element, retrying...', error);
        focusAttempts.current++;
        setTimeout(attemptFocus, 50);
      }
    };
    
    // Delay initial focus to allow dialog to fully render
    setTimeout(attemptFocus, 100);
  }, [isOpen, initialFocusRef, maxFocusAttempts]);
  
  // Return focus to previous element when dialog closes
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      // Use finalFocusRef if provided
      if (finalFocusRef?.current) {
        try {
          finalFocusRef.current.focus();
        } catch (error) {
          console.warn('Failed to focus final element:', error);
          // Fallback to previous element
          if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
            previousFocusRef.current.focus();
          }
        }
        return;
      }
      
      // Otherwise return to previous element
      const timer = setTimeout(() => {
        try {
          if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
            previousFocusRef.current.focus();
          }
        } catch (error) {
          console.warn('Failed to restore focus:', error);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, finalFocusRef]);
  
  return { 
    dialogRef, 
    returnFocus: () => {
      try {
        if (finalFocusRef?.current) {
          finalFocusRef.current.focus();
        } else if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      } catch (error) {
        console.warn('Failed to manually return focus:', error);
      }
    } 
  };
}
