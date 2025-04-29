
import { useEffect } from 'react';

/**
 * Hook to fix pointer events related issues in the application.
 * This is needed to prevent pointer-events: none from being applied
 * to the body, which breaks interaction especially after dialogs open.
 */
export function usePointerEventsFix() {
  useEffect(() => {
    const fixPointerEvents = () => {
      // Ensure body always has pointer events enabled
      document.body.style.pointerEvents = 'auto';
    };
    
    // Run immediately
    fixPointerEvents();
    
    // Set up interval to ensure it stays fixed
    const intervalId = setInterval(fixPointerEvents, 1000);
    
    // Set up event listeners for common actions that might affect pointer events
    document.addEventListener('click', fixPointerEvents);
    document.addEventListener('touchstart', fixPointerEvents);
    document.addEventListener('mousemove', fixPointerEvents);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('click', fixPointerEvents);
      document.removeEventListener('touchstart', fixPointerEvents);
      document.removeEventListener('mousemove', fixPointerEvents);
    };
  }, []);
}
