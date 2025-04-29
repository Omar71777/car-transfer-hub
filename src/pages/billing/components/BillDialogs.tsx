
import React, { useEffect } from 'react';
import { Bill, CreateBillDto } from '@/types/billing';
import { useDialogOpener } from '@/hooks/use-dialog-opener';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BillForm } from '@/components/billing/BillForm';
import { BillEditForm } from '@/components/billing/BillEditForm';
import { BillDetail } from '@/components/billing/BillDetail';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

interface BillDialogsProps {
  isFormDialogOpen: boolean;
  setIsFormDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedBill: Bill | null;
  viewBill: Bill | null;
  handleEditBill: (bill: Bill) => void;
  handleFormSubmit: (values: CreateBillDto) => Promise<void>;
  handleEditSubmit: (id: string, data: Partial<Bill>, addedTransferIds?: string[], removedTransferIds?: string[]) => Promise<void>;
  handleConfirmDelete: () => Promise<void>;
  handlePrintBill: (bill: Bill) => Promise<void>;
  handleDownloadBill: (bill: Bill) => Promise<void>;
  handleStatusChange: (status: Bill['status']) => Promise<void>;
}

export function BillDialogs({
  isFormDialogOpen,
  setIsFormDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedBill,
  viewBill,
  handleEditBill,
  handleFormSubmit,
  handleEditSubmit,
  handleConfirmDelete,
  handlePrintBill,
  handleDownloadBill,
  handleStatusChange,
}: BillDialogsProps) {
  const { openDialog, closeDialog } = useDialogOpener();
  
  // Track dialog opening state to prevent multiple dialog opens
  const isOpeningDialog = React.useRef(false);
  
  // Safety timeouts for dialog operations
  const safetyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Clean up timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle form dialog with enhanced dialog opener
  useEffect(() => {
    if (isFormDialogOpen) {
      // Prevent multiple dialog opens
      if (isOpeningDialog.current) return;
      isOpeningDialog.current = true;
      
      // Force pointer events to be enabled
      document.body.style.pointerEvents = 'auto';
      
      // Clear any existing safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
      
      try {
        openDialog({
          content: (
            <>
              <DialogHeader>
                <DialogTitle id="dialog-title">Crear Nueva Factura</DialogTitle>
                <DialogDescription>
                  Rellena el formulario para crear una nueva factura.
                </DialogDescription>
              </DialogHeader>
              <BillForm onSubmit={async (values) => {
                // Force pointer events to be enabled during submission
                document.body.style.pointerEvents = 'auto';
                
                try {
                  await handleFormSubmit(values);
                  closeDialog();
                  setIsFormDialogOpen(false);
                } catch (error) {
                  console.error('Error submitting bill form:', error);
                  toast.error('Error al crear la factura.');
                  document.body.style.pointerEvents = 'auto';
                }
              }} />
            </>
          ),
          width: 'full',
          preventOutsideClose: true,
          onClose: () => {
            // Force pointer events to be enabled when closing
            document.body.style.pointerEvents = 'auto';
            setIsFormDialogOpen(false);
            
            // Reset opening flag after a delay to prevent rapid reopening
            setTimeout(() => {
              isOpeningDialog.current = false;
            }, 300);
          },
          ariaLabel: "Crear nueva factura",
          role: 'dialog'
        });
        
        // Add safety timeout to reset opening flag if dialog never opens
        safetyTimeoutRef.current = setTimeout(() => {
          isOpeningDialog.current = false;
          document.body.style.pointerEvents = 'auto';
          safetyTimeoutRef.current = null;
        }, 1000);
      } catch (error) {
        console.error('Error opening form dialog:', error);
        // Reset opening flag and ensure pointer events on error
        isOpeningDialog.current = false;
        document.body.style.pointerEvents = 'auto';
      }
    } else {
      // If dialog is closed, reset opening flag
      isOpeningDialog.current = false;
    }
  }, [isFormDialogOpen, handleFormSubmit, setIsFormDialogOpen, openDialog, closeDialog]);
  
  // Handle view dialog with enhanced dialog opener
  useEffect(() => {
    if (isViewDialogOpen && viewBill) {
      // Prevent multiple dialog opens
      if (isOpeningDialog.current) return;
      isOpeningDialog.current = true;
      
      // Force pointer events to be enabled
      document.body.style.pointerEvents = 'auto';
      
      try {
        openDialog({
          content: (
            <>
              <DialogHeader>
                <DialogTitle id="dialog-title">Detalle de Factura</DialogTitle>
                <DialogDescription>
                  Vista detallada de la factura seleccionada.
                </DialogDescription>
              </DialogHeader>
              <BillDetail
                bill={viewBill}
                onEdit={() => {
                  // Force pointer events to be enabled
                  document.body.style.pointerEvents = 'auto';
                  
                  // Close view dialog before opening edit dialog
                  closeDialog();
                  setIsViewDialogOpen(false);
                  
                  // Add a short delay to ensure view dialog closes first
                  setTimeout(() => {
                    isOpeningDialog.current = false; // Allow next dialog to open
                    handleEditBill(viewBill);
                  }, 300);
                }}
                onPrint={async (bill) => {
                  // Force pointer events to be enabled
                  document.body.style.pointerEvents = 'auto';
                  await handlePrintBill(bill);
                }}
                onDownload={async () => {
                  // Force pointer events to be enabled
                  document.body.style.pointerEvents = 'auto';
                  await handleDownloadBill(viewBill);
                }}
                onStatusChange={async (status) => {
                  // Force pointer events to be enabled
                  document.body.style.pointerEvents = 'auto';
                  await handleStatusChange(status);
                }}
              />
            </>
          ),
          width: 'full',
          preventOutsideClose: true,
          onClose: () => {
            // Force pointer events to be enabled when closing
            document.body.style.pointerEvents = 'auto';
            setIsViewDialogOpen(false);
            
            // Reset opening flag after a delay to prevent rapid reopening
            setTimeout(() => {
              isOpeningDialog.current = false;
            }, 300);
          },
          ariaLabel: "Detalle de factura",
          role: 'dialog'
        });
      } catch (error) {
        console.error('Error opening view dialog:', error);
        // Reset opening flag and ensure pointer events on error
        isOpeningDialog.current = false;
        document.body.style.pointerEvents = 'auto';
      }
    } else {
      // If view is not open, allow other dialogs to open
      if (isViewDialogOpen) {
        isOpeningDialog.current = false;
      }
    }
  }, [isViewDialogOpen, viewBill, setIsViewDialogOpen, handleEditBill, handlePrintBill, handleDownloadBill, handleStatusChange, openDialog, closeDialog]);
  
  // Handle edit dialog with enhanced dialog opener
  useEffect(() => {
    if (isEditDialogOpen && selectedBill) {
      // Prevent multiple dialog opens
      if (isOpeningDialog.current) return;
      isOpeningDialog.current = true;
      
      // Force pointer events to be enabled
      document.body.style.pointerEvents = 'auto';
      
      try {
        openDialog({
          content: (
            <>
              <DialogHeader>
                <DialogTitle id="dialog-title">Editar Factura</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la factura seleccionada.
                </DialogDescription>
              </DialogHeader>
              <BillEditForm 
                bill={selectedBill} 
                onSubmit={async (data, addedTransferIds, removedTransferIds) => {
                  // Force pointer events to be enabled during submission
                  document.body.style.pointerEvents = 'auto';
                  
                  try {
                    await handleEditSubmit(selectedBill.id, data, addedTransferIds, removedTransferIds);
                    closeDialog();
                    setIsEditDialogOpen(false);
                  } catch (error) {
                    console.error('Error submitting edit form:', error);
                    toast.error('Error al actualizar la factura.');
                    document.body.style.pointerEvents = 'auto';
                  }
                }} 
              />
            </>
          ),
          width: 'full',
          preventOutsideClose: true,
          onClose: () => {
            // Force pointer events to be enabled when closing
            document.body.style.pointerEvents = 'auto';
            setIsEditDialogOpen(false);
            
            // Reset opening flag after a delay to prevent rapid reopening
            setTimeout(() => {
              isOpeningDialog.current = false;
            }, 300);
          },
          ariaLabel: "Editar factura",
          role: 'dialog'
        });
      } catch (error) {
        console.error('Error opening edit dialog:', error);
        // Reset opening flag and ensure pointer events on error
        isOpeningDialog.current = false;
        document.body.style.pointerEvents = 'auto';
      }
    } else {
      // If edit is not open, allow other dialogs to open
      if (isEditDialogOpen) {
        isOpeningDialog.current = false;
      }
    }
  }, [isEditDialogOpen, selectedBill, handleEditSubmit, setIsEditDialogOpen, openDialog, closeDialog]);
  
  // Return only the AlertDialog for deletion confirmation
  // All other dialogs are handled through the dialog service
  return (
    <AlertDialog 
      open={isDeleteDialogOpen} 
      onOpenChange={(open) => {
        if (!open) {
          // Force pointer events to be enabled when closing
          document.body.style.pointerEvents = 'auto';
          setIsDeleteDialogOpen(false);
        }
      }}
    >
      <AlertDialogContent className="max-w-[min(450px,90vw)]">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la factura{' '}
            <strong>{selectedBill?.number}</strong> del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            // Force pointer events to be enabled when cancelling
            document.body.style.pointerEvents = 'auto';
          }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            // Force pointer events to be enabled during deletion
            document.body.style.pointerEvents = 'auto';
            
            try {
              await handleConfirmDelete();
            } catch (error) {
              console.error('Error deleting bill:', error);
              toast.error('Error al eliminar la factura.');
              document.body.style.pointerEvents = 'auto';
            }
          }} className="bg-destructive text-destructive-foreground">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
