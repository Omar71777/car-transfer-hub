
import { useEffect } from 'react';

export function usePointerEventsCleanup() {
  // Global cleanup for pointer events issues
  useEffect(() => {
    // Ensure pointer-events are always enabled when component mounts
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = '';
    
    // Create a MutationObserver to watch for style changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const bodyStyle = document.body.style;
          // Reset any problematic styles that block interactions
          if (bodyStyle.pointerEvents === 'none' || bodyStyle.overflow === 'hidden') {
            setTimeout(() => {
              document.body.style.pointerEvents = 'auto';
              document.body.style.overflow = '';
            }, 100);
          }
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    
    // Clean up
    return () => {
      observer.disconnect();
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = '';
    };
  }, []);
}
