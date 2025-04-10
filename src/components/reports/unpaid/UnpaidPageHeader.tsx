
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileDown } from 'lucide-react';

interface UnpaidPageHeaderProps {
  onExportCSV: () => void;
  onPrint: () => void;
}

export function UnpaidPageHeader({ onExportCSV, onPrint }: UnpaidPageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-1 text-primary">Pagos Pendientes</h1>
        <p className="text-muted-foreground">Gestión de pagos pendientes a colaboradores</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportCSV}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
        <Button variant="outline" onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>
    </div>
  );
}
