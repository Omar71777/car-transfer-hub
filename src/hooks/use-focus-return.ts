
import { useEffect, useRef } from 'react';

/**
 * Hook to manage focus return after dialogs.
 * This keeps track of the previously focused element and
 * returns focus to it after the dialog is closed.
 */
export function useFocusReturn() {
  // Store the previously focused element
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Save the currently focused element when the component mounts
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Return focus to the previously focused element when the component unmounts
    return () => {
      if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
        // Add a small timeout to ensure DOM operations are completed
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 10);
      }
    };
  }, []);
  
  // Function to manually return focus
  const returnFocus = () => {
    if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };
  
  return { returnFocus };
}
