import { useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Enhanced hook to fix pointer events issues in dialogs and during transitions
 * This centralized implementation replaces both previous pointer event fix hooks
 */
export function usePointerEventsFix() {
  const isMobile = useIsMobile();
  const observerRef = useRef<MutationObserver | null>(null);
  
  useEffect(() => {
    // Always ensure pointer events are enabled when component mounts
    document.body.style.pointerEvents = 'auto';
    
    // Reset any stuck overflow settings
    if (document.body.style.overflow === 'hidden' && !document.querySelector('[role="dialog"], [role="alertdialog"]')) {
      document.body.style.overflow = '';
    }
    
    // For mobile devices, apply additional touch handling
    if (isMobile) {
      // Apply touch-action CSS to document root for better mobile performance
      document.documentElement.style.touchAction = 'manipulation';
      
      // Add passive touch listeners to improve scrolling performance
      const options = { passive: true };
      
      // Function to prevent bouncing on iOS when scrolling at edges
      const handleTouchMove = (event: TouchEvent) => {
        // Only prevent default if not in an element that should scroll
        const target = event.target as HTMLElement;
        const isScrollable = 
          target.closest('.overflow-y-auto') || 
          target.closest('.overflow-x-auto') ||
          target.closest('.overflow-scroll') ||
          target.closest('.scrollable');
          
        if (!isScrollable) {
          event.preventDefault();
        }
      };
      
      document.addEventListener('touchstart', () => {}, options);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      return () => {
        document.removeEventListener('touchstart', () => {}, options as EventListenerOptions);
        document.removeEventListener('touchmove', handleTouchMove);
        document.documentElement.style.touchAction = '';
      };
    }
    
    // Create mutation observer to watch for dialog state changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-state') {
          const target = mutation.target as HTMLElement;
          const state = target.getAttribute('data-state');
          
          // When dialog is opening or closing, ensure pointer events are enabled
          if (state === 'open' || state === 'closed') {
            // Immediate fix 
            document.body.style.pointerEvents = 'auto';
            
            // Add delayed check to catch any post-animation issues
            setTimeout(() => {
              document.body.style.pointerEvents = 'auto';
              
              // Only reset overflow if all dialogs are closed
              if (state === 'closed' && !document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]')) {
                document.body.style.overflow = '';
              }
            }, 100);
          }
        }
      }
    });
    
    // Start observing all dialogs and keep reference
    observerRef.current = observer;
    document.querySelectorAll('[role="dialog"], [role="alertdialog"], .dialog-content').forEach(dialog => {
      observer.observe(dialog, { attributes: true, attributeFilter: ['data-state'] });
    });
    
    // Watch for new dialogs being added to the DOM
    const bodyObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              // Find any new dialogs and observe them
              const dialogs = node.querySelectorAll('[role="dialog"], [role="alertdialog"], .dialog-content');
              dialogs.forEach(dialog => {
                observer.observe(dialog, { attributes: true, attributeFilter: ['data-state'] });
              });
            }
          });
        }
      }
    });
    
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    
    // Global safety net - periodically check and fix stuck pointer events
    const safetyInterval = setInterval(() => {
      // If there are no open dialogs but pointer events are none, fix it
      const hasOpenDialog = document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], .dialog-content[data-state="open"]');
      
      if (!hasOpenDialog && document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = 'auto';
      }
      
      // If all dialogs are closed but overflow is still hidden, reset it
      if (!hasOpenDialog && document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
    }, 1000);
    
    // Proper cleanup to prevent memory leaks
    return () => {
      observer.disconnect();
      bodyObserver.disconnect();
      clearInterval(safetyInterval);
      
      // Final cleanup of styles
      document.body.style.pointerEvents = 'auto';
      
      // Only reset overflow if no dialogs are open
      const hasOpenDialog = document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], .dialog-content[data-state="open"]');
      if (!hasOpenDialog) {
        document.body.style.overflow = '';
      }
    };
  }, [isMobile]);
  
  return null;
}
