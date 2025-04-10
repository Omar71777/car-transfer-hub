
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Printer, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TransfersPageHeaderProps {
  onExportCSV: () => void;
  onPrint: () => void;
}

export function TransfersPageHeader({ onExportCSV, onPrint }: TransfersPageHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">Informes de Transfers</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Análisis detallado de los transfers realizados</p>
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
