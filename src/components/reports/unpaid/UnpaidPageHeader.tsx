import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileDown } from 'lucide-react';
interface UnpaidPageHeaderProps {
  onExportCSV: () => void;
  onPrint: () => void;
}
export function UnpaidPageHeader({
  onExportCSV,
  onPrint
}: UnpaidPageHeaderProps) {
  return <div className="flex justify-between items-center mb-6 px-0 py-0 my-0 mx-0">
      <div>
        <h1 className="font-bold mb-1 text-primary text-left text-2xl">Pagos Pendientes</h1>
        <p className="text-muted-foreground text-left text-sm">Gestión de pagos pendientes </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportCSV} className="text-center mx-0 my-0">
          <FileDown className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
        <Button variant="outline" onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>
    </div>;
}