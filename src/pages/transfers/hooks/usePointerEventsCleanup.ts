
import { useEffect } from 'react';

export function usePointerEventsCleanup() {
  // Global cleanup for pointer events issues
  useEffect(() => {
    // Ensure pointer-events are always enabled when component mounts
    document.body.style.pointerEvents = 'auto';
    
    // Create a MutationObserver to watch for style changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const bodyStyle = document.body.style;
          if (bodyStyle.pointerEvents === 'none') {
            // Fix it after a short delay to allow other code to finish
            setTimeout(() => {
              document.body.style.pointerEvents = 'auto';
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
    };
  }, []);
}
