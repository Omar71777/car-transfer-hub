
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileDown, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UnpaidPageHeaderProps {
  onExportCSV: () => void;
  onPrint: () => void;
}

export function UnpaidPageHeader({
  onExportCSV,
  onPrint
}: UnpaidPageHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-primary text-left">Pagos Pendientes</h1>
        <p className="text-muted-foreground text-left text-sm">Gestión de pagos pendientes</p>
      </div>
      
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Acciones
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
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
      )}
    </div>
  );
}
