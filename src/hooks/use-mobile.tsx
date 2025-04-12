
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile devices based on screen width
 * @param breakpoint The screen width breakpoint to consider as mobile (default: 768px)
 * @returns Boolean indicating if the device is considered mobile
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    // Default to false on server-side
    return false;
  });

  useEffect(() => {
    // Skip if window is not available
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    // Initial check
    checkMobile();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

/**
 * Custom hook to detect if a device supports touch
 * @returns Boolean indicating if the device supports touch
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  
  useEffect(() => {
    const hasTouch = (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      (navigator.msMaxTouchPoints !== undefined && navigator.msMaxTouchPoints > 0)
    );
    
    setIsTouch(hasTouch);
  }, []);
  
  return isTouch;
}
