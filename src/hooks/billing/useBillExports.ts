
import { useCallback } from 'react';
import { toast } from 'sonner';

export function useBillExports(getBill: (id: string) => Promise<any>) {
  const exportBillCsv = useCallback(async (id: string) => {
    try {
      const bill = await getBill(id);
      if (!bill) throw new Error('Factura no encontrada');
      
      const { exportBillCsv } = await import('@/lib/exports/billExport');
      exportBillCsv(bill);
      
      return true;
    } catch (error: any) {
      toast.error(`Error al exportar factura: ${error.message}`);
      console.error('Error exporting bill:', error);
      return false;
    }
  }, [getBill]);

  const printBill = useCallback(async (id: string) => {
    try {
      const bill = await getBill(id);
      if (!bill) throw new Error('Factura no encontrada');
      
      const { printBill } = await import('@/lib/exports/billExport');
      printBill(bill);
      
      return true;
    } catch (error: any) {
      toast.error(`Error al imprimir factura: ${error.message}`);
      console.error('Error printing bill:', error);
      return false;
    }
  }, [getBill]);

  return {
    exportBillCsv,
    printBill
  };
}
