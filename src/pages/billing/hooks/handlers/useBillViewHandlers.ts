
import { Bill } from '@/types/billing';
import { toast } from 'sonner';

export function useBillViewHandlers(
  getBill: (id: string) => Promise<Bill | null>,
  printBill: (id: string) => Promise<boolean>,
  exportBillCsv: (id: string) => Promise<boolean>
) {
  const handleViewBill = async (
    bill: Bill,
    setViewBill: (bill: Bill | null) => void,
    setIsViewDialogOpen: (isOpen: boolean) => void,
    setIsLoading: (isLoading: boolean) => void
  ) => {
    try {
      setIsLoading(true);
      // Fetch the complete bill with items
      const fullBill = await getBill(bill.id);
      if (fullBill) {
        console.log('Viewing bill with items:', fullBill.items);
        setViewBill(fullBill);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error viewing bill:', error);
      toast.error('Error al cargar la factura');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintBill = async (bill: Bill) => {
    try {
      await printBill(bill.id);
    } catch (error) {
      console.error('Error printing bill:', error);
      toast.error('Error al imprimir la factura');
    }
  };

  const handleDownloadBill = async (bill: Bill) => {
    try {
      await exportBillCsv(bill.id);
    } catch (error) {
      console.error('Error downloading bill:', error);
      toast.error('Error al exportar la factura');
    }
  };

  const handleStatusChange = async (
    status: Bill['status'],
    viewBill: Bill | null,
    updateBillStatus: (id: string, status: Bill['status']) => Promise<boolean>,
    getBill: (id: string) => Promise<Bill | null>,
    setViewBill: (bill: Bill | null) => void,
    fetchBills: () => Promise<void>
  ) => {
    if (!viewBill) return;

    try {
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
    } catch (error) {
      console.error('Error changing bill status:', error);
      toast.error('Error al cambiar el estado de la factura');
    }
  };

  return {
    handleViewBill,
    handlePrintBill,
    handleDownloadBill,
    handleStatusChange
  };
}
