
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Hook to fix pointer events issues on mobile devices
 * Especially for fixed position elements like dialogs
 */
export function usePointerEventsFix() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isMobile) return;
    
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
    
    // Apply touch-action CSS to document root
    document.documentElement.style.touchAction = 'manipulation';
    
    // Add passive listeners for better performance
    document.addEventListener('touchstart', () => {}, options);
    
    // Add non-passive listener only for touch events that might cause bouncing
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      // Clean up
      document.removeEventListener('touchstart', () => {}, options as EventListenerOptions);
      document.removeEventListener('touchmove', handleTouchMove);
      document.documentElement.style.touchAction = '';
    };
  }, [isMobile]);
  
  return null;
}
