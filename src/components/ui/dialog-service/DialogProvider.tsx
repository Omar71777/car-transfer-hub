
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface DialogContextType {
  openDialog: (content: ReactNode, options?: DialogOptions) => void;
  closeDialog: () => void;
}

interface DialogOptions {
  className?: string;
  preventOutsideClose?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose?: () => void;
  focusFirst?: boolean;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  
  const openDialog = (content: ReactNode, options: DialogOptions = {}) => {
    // Store currently focused element before opening dialog
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    setDialogContent(content);
    setDialogOptions(options);
    setIsOpen(true);
    document.body.classList.add('dialog-open');
    document.body.style.pointerEvents = 'auto';
  };

  const closeDialog = () => {
    setIsOpen(false);
    document.body.classList.remove('dialog-open');
    
    // Execute onClose callback if provided
    if (dialogOptions.onClose) {
      dialogOptions.onClose();
    }
    
    // Return focus to the element that was focused before the dialog opened
    setTimeout(() => {
      if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }, 10);
  };
  
  // Focus first focusable element when dialog opens
  useEffect(() => {
    if (!isOpen || !dialogRef.current || dialogOptions.focusFirst === false) return;
    
    const timer = setTimeout(() => {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isOpen, dialogOptions.focusFirst]);

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
            if (!dialogOptions.preventOutsideClose) {
              closeDialog();
            } else {
              e.preventDefault();
            }
          }}
          ref={dialogRef}
          onInteractOutside={(e) => {
            // Prevent interaction outside if configured
            if (dialogOptions.preventOutsideClose) {
              e.preventDefault();
            }
          }}
        >
          {dialogContent}
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
