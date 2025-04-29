
import React, { useEffect } from 'react';
import { Bill, CreateBillDto } from '@/types/billing';
import { useDialog } from '@/components/ui/dialog-service';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BillForm } from '@/components/billing/BillForm';
import { BillEditForm } from '@/components/billing/BillEditForm';
import { BillDetail } from '@/components/billing/BillDetail';
import { usePointerEventsFix } from '@/hooks/use-pointer-events-fix';

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
  const dialogService = useDialog();
  
  // Apply the pointer events fix hook
  usePointerEventsFix();
  
  // Handle form dialog with the dialog service
  useEffect(() => {
    if (isFormDialogOpen) {
      dialogService.openDialog(
        <>
          <DialogHeader>
            <DialogTitle>Crear Nueva Factura</DialogTitle>
            <DialogDescription>
              Rellena el formulario para crear una nueva factura.
            </DialogDescription>
          </DialogHeader>
          <BillForm onSubmit={async (values) => {
            await handleFormSubmit(values);
            setIsFormDialogOpen(false);
          }} />
        </>,
        {
          width: 'full',
          preventOutsideClose: true,
          onClose: () => {
            document.body.style.pointerEvents = 'auto';
            setIsFormDialogOpen(false);
          }
        }
      );
    }
  }, [isFormDialogOpen, dialogService, handleFormSubmit, setIsFormDialogOpen]);
  
  // Handle view dialog with the dialog service
  useEffect(() => {
    if (isViewDialogOpen && viewBill) {
      dialogService.openDialog(
        <>
          <DialogHeader>
            <DialogTitle>Detalle de Factura</DialogTitle>
            <DialogDescription>
              Vista detallada de la factura seleccionada.
            </DialogDescription>
          </DialogHeader>
          <BillDetail
            bill={viewBill}
            onEdit={() => {
              // Close view dialog before opening edit dialog
              dialogService.closeDialog();
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
        </>,
        {
          width: 'full',
          preventOutsideClose: true,
          onClose: () => {
            document.body.style.pointerEvents = 'auto';
            setIsViewDialogOpen(false);
          }
        }
      );
    }
  }, [isViewDialogOpen, viewBill, dialogService, setIsViewDialogOpen, handleEditBill, handlePrintBill, handleDownloadBill, handleStatusChange]);
  
  // Handle edit dialog with the dialog service
  useEffect(() => {
    if (isEditDialogOpen && selectedBill) {
      dialogService.openDialog(
        <>
          <DialogHeader>
            <DialogTitle>Editar Factura</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la factura seleccionada.
            </DialogDescription>
          </DialogHeader>
          <BillEditForm 
            bill={selectedBill} 
            onSubmit={async (data, addedTransferIds, removedTransferIds) => {
              await handleEditSubmit(selectedBill.id, data, addedTransferIds, removedTransferIds);
              setIsEditDialogOpen(false);
            }} 
          />
        </>,
        {
          width: 'full',
          preventOutsideClose: true,
          onClose: () => {
            document.body.style.pointerEvents = 'auto';
            setIsEditDialogOpen(false);
          }
        }
      );
    }
  }, [isEditDialogOpen, selectedBill, dialogService, handleEditSubmit, setIsEditDialogOpen]);
  
  // Return only the AlertDialog for deletion confirmation
  // All other dialogs are handled through the dialog service
  return (
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
          <AlertDialogAction onClick={() => handleConfirmDelete()} className="bg-destructive text-destructive-foreground">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
