
import { ReactNode, useRef } from 'react';
import { useDialog, DialogOptions } from '@/components/ui/dialog-service/DialogProvider';

interface DialogOpenerOptions extends DialogOptions {
  content: ReactNode;
}

/**
 * Hook that provides standardized dialog opening functionality
 * with proper focus management and accessibility
 */
export function useDialogOpener() {
  const dialogService = useDialog();
  const initialFocusRef = useRef<HTMLElement>(null);
  const finalFocusRef = useRef<HTMLElement>(null);
  
  // Function to open a dialog with standardized options
  const openAccessibleDialog = ({
    content,
    ...options
  }: DialogOpenerOptions) => {
    // Set focus references if not provided
    const dialogOptions: DialogOptions = {
      ...options,
      initialFocusRef: options.initialFocusRef || initialFocusRef,
      finalFocusRef: options.finalFocusRef || finalFocusRef
    };
    
    // Ensure pointer events are always enabled
    document.body.style.pointerEvents = 'auto';
    
    // Open the dialog with our content and options
    dialogService.openDialog(content, dialogOptions);
  };
  
  return {
    openDialog: openAccessibleDialog,
    closeDialog: dialogService.closeDialog,
    initialFocusRef,
    finalFocusRef
  };
}
