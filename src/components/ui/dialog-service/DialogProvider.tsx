
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});

  const openDialog = (content: ReactNode, options: DialogOptions = {}) => {
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
