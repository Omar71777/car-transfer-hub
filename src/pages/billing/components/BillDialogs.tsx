
import React from 'react';
import { Bill, CreateBillDto } from '@/types/billing';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  
  return (
    <>
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="dialog-content w-full max-w-[min(800px,90vw)] overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Factura</DialogTitle>
          </DialogHeader>
          <BillForm onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen}
      >
        <DialogContent className="dialog-content w-full max-w-[min(800px,90vw)] overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Detalle de Factura</DialogTitle>
          </DialogHeader>
          {viewBill && (
            <BillDetail
              bill={viewBill}
              onEdit={() => {
                setIsViewDialogOpen(false);
                handleEditBill(viewBill);
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
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="dialog-content w-full max-w-[min(800px,90vw)] overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Editar Factura</DialogTitle>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
