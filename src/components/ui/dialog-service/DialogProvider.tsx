
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useDialogManagement } from '@/hooks/use-dialog-management';

interface DialogContextType {
  openDialog: (content: ReactNode, options?: DialogOptions) => void;
  closeDialog: () => void;
}

export interface DialogOptions {
  className?: string;
  preventOutsideClose?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose?: () => void;
  focusFirst?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  finalFocusRef?: React.RefObject<HTMLElement>;
  preserveScrollPosition?: boolean;
  role?: 'dialog' | 'alertdialog';
  ariaLabel?: string;
  ariaDescribedby?: string;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});
  const initialFocusRef = useRef<HTMLElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeCallbackRef = useRef<(() => void) | null>(null);
  const scrollPositionRef = useRef(0);
  
  // Define closeDialog function before it's used
  const closeDialog = () => {
    // Cancel any pending transition timeouts
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    
    // Start close animation - pointer events must be enabled during animations
    document.body.style.pointerEvents = 'auto';
    
    // Close dialog with animation
    setIsOpen(false);
    
    // Store onClose callback to execute later after animation completes
    closeCallbackRef.current = dialogOptions.onClose || null;
    
    // Remove dialog-open class after dialog is closed
    setTimeout(() => {
      document.body.classList.remove('dialog-open');
      document.body.style.pointerEvents = 'auto';
      
      // Restore scroll position if needed
      if (dialogOptions.preserveScrollPosition) {
        window.scrollTo(0, scrollPositionRef.current);
      }
      
      // Remove aria-hidden from main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
      
      // Execute onClose callback after animation completes
      if (closeCallbackRef.current) {
        closeCallbackRef.current();
        closeCallbackRef.current = null;
      }
    }, 300); // Match animation duration
  };
  
  const { dialogRef } = useDialogManagement({
    isOpen,
    onClose: dialogOptions.preventOutsideClose ? undefined : closeDialog,
    initialFocusRef: dialogOptions.initialFocusRef,
    finalFocusRef: dialogOptions.finalFocusRef
  });

  // Reset closeCallbackRef when dialog options change
  useEffect(() => {
    closeCallbackRef.current = null;
  }, [dialogOptions]);
  
  const openDialog = (content: ReactNode, options: DialogOptions = {}) => {
    // Cancel any pending transition timeouts
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    
    // Clear any previous close callback
    closeCallbackRef.current = null;
    
    // Store scroll position if enabled
    if (options.preserveScrollPosition) {
      scrollPositionRef.current = window.scrollY;
    }
    
    // Force pointer events to auto before opening dialog
    document.body.style.pointerEvents = 'auto';
    
    // Set content and options first
    setDialogContent(content);
    setDialogOptions(options);
    
    // Add necessary classes and set dialog state with requestAnimationFrame
    // to ensure browser has time to process style changes
    requestAnimationFrame(() => {
      document.body.classList.add('dialog-open');
      
      // Set aria-hidden on main content for accessibility
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }
      
      // Use another frame to set open state to prevent layout thrashing
      requestAnimationFrame(() => {
        setIsOpen(true);
        
        // Add a safety timeout to reset pointer events in case animation fails
        transitionTimeoutRef.current = setTimeout(() => {
          document.body.style.pointerEvents = 'auto';
          transitionTimeoutRef.current = null;
        }, 500); // Longer than animation to ensure it completes
      });
    });
  };

  const getWidthClass = () => {
    switch (dialogOptions.width) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case 'full': return 'max-w-[92vw] w-full';
      default: return 'max-w-[min(800px,90vw)]';
    }
  };

  // Match dialog container to role for ARIA
  const dialogRole = dialogOptions.role || 'dialog';
  const describedBy = dialogOptions.ariaDescribedby || 'dialog-description';

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      document.body.classList.remove('dialog-open');
      document.body.style.pointerEvents = 'auto';
      
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    };
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open && !dialogOptions.preventOutsideClose) {
            closeDialog();
          }
        }}
      >
        <DialogContent 
          className={`dialog-content dialog-animation-enter dialog-glass overflow-y-auto max-h-[85vh] ${getWidthClass()} ${dialogOptions.className || ''}`}
          onPointerDownOutside={(e) => {
            if (dialogOptions.preventOutsideClose) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (dialogOptions.preventOutsideClose) {
              e.preventDefault();
            } else {
              closeDialog();
            }
          }}
          ref={dialogRef}
          onInteractOutside={(e) => {
            // Prevent interaction outside if configured
            if (dialogOptions.preventOutsideClose) {
              e.preventDefault();
            }
          }}
          onClick={(e) => {
            // Ensure pointer events are enabled when interacting with dialog
            document.body.style.pointerEvents = 'auto';
            e.stopPropagation();
          }}
          aria-labelledby={dialogOptions.ariaLabel ? undefined : 'dialog-title'}
          aria-label={dialogOptions.ariaLabel}
          aria-describedby={describedBy}
          role={dialogRole}
        >
          {dialogContent}
          <div id="dialog-description" className="sr-only">
            Dialog content
          </div>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  
  return context;
}
