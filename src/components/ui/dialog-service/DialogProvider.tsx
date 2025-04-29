
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
  
  // Define closeDialog function before it's used
  const closeDialog = () => {
    setIsOpen(false);
    document.body.classList.remove('dialog-open');
    
    // Restore scroll position if needed
    if (dialogOptions.preserveScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 50);
    }
    
    // Remove aria-hidden from main content
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.removeAttribute('aria-hidden');
    }
    
    // Execute onClose callback if provided
    if (dialogOptions.onClose) {
      dialogOptions.onClose();
    }
  };
  
  const { dialogRef } = useDialogManagement({
    isOpen,
    onClose: dialogOptions.preventOutsideClose ? undefined : closeDialog,
    initialFocusRef: dialogOptions.initialFocusRef,
    finalFocusRef: dialogOptions.finalFocusRef
  });

  // Save scroll position if needed
  const scrollPositionRef = useRef(0);
  
  const openDialog = (content: ReactNode, options: DialogOptions = {}) => {
    // Store scroll position if enabled
    if (options.preserveScrollPosition) {
      scrollPositionRef.current = window.scrollY;
    }
    
    setDialogContent(content);
    setDialogOptions(options);
    setIsOpen(true);
    document.body.classList.add('dialog-open');
    
    // Set aria-hidden on main content for accessibility
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('aria-hidden', 'true');
    }
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
          className={`dialog-content overflow-y-auto max-h-[85vh] ${getWidthClass()} ${dialogOptions.className || ''}`}
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
