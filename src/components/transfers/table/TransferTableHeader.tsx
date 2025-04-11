
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransferTableHeaderProps {
  onSelectAll?: (selected: boolean) => void;
  allSelected?: boolean;
  someSelected?: boolean;
}

export function TransferTableHeader({ 
  onSelectAll, 
  allSelected = false, 
  someSelected = false 
}: TransferTableHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          {onSelectAll && (
            <Checkbox 
              id="select-all"
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
              className={someSelected ? "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground" : ""}
              data-state={someSelected && !allSelected ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked')}
            />
          )}
        </TableHead>
        <TableHead>Fecha</TableHead>
        {!isMobile && <TableHead>Hora</TableHead>}
        <TableHead>Tipo</TableHead>
        <TableHead>Origen</TableHead>
        <TableHead>Destino</TableHead>
        <TableHead className="text-right">Precio</TableHead>
        {!isMobile && <TableHead>Cliente</TableHead>}
        {!isMobile && <TableHead>Colaborador</TableHead>}
        {!isMobile && <TableHead className="text-right">Comisión</TableHead>}
        <TableHead className="text-center">Estado</TableHead>
        <TableHead className="text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
