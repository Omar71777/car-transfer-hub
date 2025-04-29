
import { useEffect, useRef } from 'react';

interface UseDialogAccessibilityProps {
  isOpen: boolean;
  onClose?: () => void;
}

/**
 * Hook to improve dialog accessibility with keyboard navigation
 * and focus management.
 */
export function useDialogAccessibility({ isOpen, onClose }: UseDialogAccessibilityProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  
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
  
  // Focus first focusable element when dialog opens
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    
    const focusableElements = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }, [isOpen]);
  
  return { dialogRef };
}
