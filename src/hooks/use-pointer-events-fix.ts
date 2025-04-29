
import { useEffect } from 'react';

/**
 * A hook to fix pointer events issues that occur in dialogs
 * and during transitions between dialog states.
 * 
 * This ensures that pointer events are always enabled when needed
 * and helps prevent UI interactions from being blocked.
 */
export function usePointerEventsFix() {
  useEffect(() => {
    // Force pointer events to be enabled when the component mounts
    document.body.style.pointerEvents = 'auto';
    
    // Also ensure scroll is enabled
    document.body.style.overflow = '';
    
    return () => {
      // When component unmounts, ensure pointer events are still enabled
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = '';
      }, 50);
    };
  }, []);
  
  // Listen for dialog transitions
  useEffect(() => {
    const handleDialogTransition = () => {
      // Re-enable pointer events after dialog animations
      document.body.style.pointerEvents = 'auto';
    };
    
    // Check for dialog state changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-state') {
          handleDialogTransition();
        }
      }
    });
    
    // Observe dialog elements for state changes
    const dialogElements = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    dialogElements.forEach(dialog => {
      observer.observe(dialog, { attributes: true });
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
}
