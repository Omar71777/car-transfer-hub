
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BillForm } from '@/components/billing/BillForm';
import { BillsTable } from '@/components/billing/BillsTable';
import { BillDetail } from '@/components/billing/BillDetail';
import { BillEditForm } from '@/components/billing/BillEditForm';
import { useBilling } from '@/hooks/useBilling';
import { Bill, CreateBillDto } from '@/types/billing';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const BillingPage = () => {
  const { 
    bills, 
    loading, 
    fetchBills, 
    createBill, 
    getBill, 
    updateBill, 
    updateBillStatus, 
    deleteBill, 
    printBill,
    exportBillCsv
  } = useBilling();

  const [activeTab, setActiveTab] = useState('bills');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleAddBill = () => {
    setIsFormDialogOpen(true);
  };

  const handleViewBill = async (bill: Bill) => {
    // Fetch the complete bill with items
    const fullBill = await getBill(bill.id);
    if (fullBill) {
      setViewBill(fullBill);
      setIsViewDialogOpen(true);
    }
  };

  const handleEditBill = async (bill: Bill) => {
    const fullBill = await getBill(bill.id);
    if (fullBill) {
      setSelectedBill(fullBill);
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDeleteDialogOpen(true);
  };

  const handlePrintBill = async (bill: Bill) => {
    await printBill(bill.id);
  };

  const handleDownloadBill = async (bill: Bill) => {
    await exportBillCsv(bill.id);
  };

  const handleFormSubmit = async (values: CreateBillDto) => {
    const billId = await createBill(values);
    if (billId) {
      toast.success('Factura creada con éxito');
      setIsFormDialogOpen(false);
      fetchBills();
      setActiveTab('bills');
    }
  };

  const handleEditSubmit = async (id: string, data: Partial<Bill>) => {
    const success = await updateBill(id, data);
    if (success) {
      toast.success('Factura actualizada con éxito');
      setIsEditDialogOpen(false);
      fetchBills();
      
      // Si la factura está siendo visualizada, actualizar la vista
      if (viewBill && viewBill.id === id) {
        const updatedBill = await getBill(id);
        if (updatedBill) {
          setViewBill(updatedBill);
        }
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBill) return;

    const success = await deleteBill(selectedBill.id);
    if (success) {
      toast.success('Factura eliminada con éxito');
      setIsDeleteDialogOpen(false);
      fetchBills();
    }
  };

  const handleStatusChange = async (status: Bill['status']) => {
    if (!viewBill) return;

    const success = await updateBillStatus(viewBill.id, status);
    if (success) {
      const statusMessages = {
        draft: 'borrador',
        sent: 'enviada',
        paid: 'pagada',
        cancelled: 'cancelada'
      };
      
      toast.success(`Factura marcada como ${statusMessages[status]}`);
      
      // Actualizar la factura en la vista
      const updatedBill = await getBill(viewBill.id);
      if (updatedBill) {
        setViewBill(updatedBill);
      }
      
      fetchBills();
    }
  };

  return (
    <MainLayout>
      <div className="py-4 md:py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Facturación</h1>
          <p className="text-muted-foreground">Gestión de facturas para clientes</p>
        </div>

        <Tabs defaultValue="bills" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="bills">Facturas</TabsTrigger>
            <TabsTrigger value="create">Crear factura</TabsTrigger>
          </TabsList>

          <TabsContent value="bills">
            <BillsTable
              bills={bills}
              onAdd={handleAddBill}
              onView={handleViewBill}
              onEdit={handleEditBill}
              onPrint={handlePrintBill}
              onDelete={handleDeleteBill}
            />
          </TabsContent>

          <TabsContent value="create">
            <BillForm onSubmit={handleFormSubmit} />
          </TabsContent>
        </Tabs>

        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
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
          <DialogContent className="sm:max-w-[800px]">
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
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Editar Factura</DialogTitle>
            </DialogHeader>
            {selectedBill && (
              <BillEditForm 
                bill={selectedBill} 
                onSubmit={(data) => handleEditSubmit(selectedBill.id, data)} 
              />
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
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
      </div>
    </MainLayout>
  );
};

export default BillingPage;
