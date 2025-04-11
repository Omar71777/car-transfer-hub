
import React, { useEffect } from 'react';
import { Bill, CreateBillDto } from '@/types/billing';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { BillForm } from '@/components/billing/BillForm';
import { BillEditForm } from '@/components/billing/BillEditForm';
import { BillDetail } from '@/components/billing/BillDetail';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Ensure pointer events are enabled when dialog opens
  useEffect(() => {
    if (isViewDialogOpen || isEditDialogOpen || isFormDialogOpen || isDeleteDialogOpen) {
      document.body.style.pointerEvents = 'auto';
    }
  }, [isViewDialogOpen, isEditDialogOpen, isFormDialogOpen, isDeleteDialogOpen]);
  
  return (
    <>
      <Dialog 
        open={isFormDialogOpen} 
        onOpenChange={(open) => {
          // Only allow closure through our state setter
          if (!open) {
            document.body.style.pointerEvents = 'auto';
            setIsFormDialogOpen(false);
          }
        }}
      >
        <DialogContent className="dialog-content w-full max-w-[min(800px,90vw)] overflow-y-auto max-h-[85vh]" onPointerDownOutside={(e) => {
          // Prevent dialog from closing on outside click
          e.preventDefault();
        }}>
          <DialogHeader>
            <DialogTitle>Crear Nueva Factura</DialogTitle>
            <DialogDescription>
              Rellena el formulario para crear una nueva factura.
            </DialogDescription>
          </DialogHeader>
          <BillForm onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isViewDialogOpen} 
        onOpenChange={(open) => {
          // Only allow closure through our state setter
          if (!open) {
            document.body.style.pointerEvents = 'auto';
            setIsViewDialogOpen(false);
          }
        }}
      >
        <DialogContent 
          className="dialog-content w-full max-w-[min(800px,90vw)] overflow-y-auto max-h-[85vh]"
          onPointerDownOutside={(e) => {
            // Prevent dialog from closing on outside click
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Detalle de Factura</DialogTitle>
            <DialogDescription>
              Vista detallada de la factura seleccionada.
            </DialogDescription>
          </DialogHeader>
          {viewBill && (
            <BillDetail
              bill={viewBill}
              onEdit={() => {
                // Explicitly set view dialog to false before opening edit dialog
                setIsViewDialogOpen(false);
                // Add a short delay to ensure view dialog closes first
                setTimeout(() => {
                  handleEditBill(viewBill);
                }, 50);
              }}
              onPrint={handlePrintBill}
              onDownload={() => handleDownloadBill(viewBill)}
              onStatusChange={handleStatusChange}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          // Only allow closure through our state setter
          if (!open) {
            document.body.style.pointerEvents = 'auto';
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent 
          className="dialog-content w-full max-w-[min(800px,90vw)] overflow-y-auto max-h-[85vh]"
          onPointerDownOutside={(e) => {
            // Prevent dialog from closing on outside click
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Editar Factura</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la factura seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <BillEditForm 
              bill={selectedBill} 
              onSubmit={(data, addedTransferIds, removedTransferIds) => 
                handleEditSubmit(selectedBill.id, data, addedTransferIds, removedTransferIds)
              } 
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
