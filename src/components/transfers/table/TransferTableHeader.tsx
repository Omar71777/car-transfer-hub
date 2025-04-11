
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
        <TableHead className="w-[36px] px-1">
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
        <TableHead className="w-[80px]">Fecha</TableHead>
        {!isMobile && <TableHead className="w-[70px]">Hora</TableHead>}
        <TableHead className="w-[80px]">Tipo</TableHead>
        <TableHead className="w-[100px]">Origen</TableHead>
        <TableHead className="w-[100px]">Destino</TableHead>
        <TableHead className="text-right w-[80px]">Precio</TableHead>
        {!isMobile && <TableHead className="w-[100px]">Cliente</TableHead>}
        {!isMobile && <TableHead className="w-[100px]">Colaborador</TableHead>}
        {!isMobile && <TableHead className="text-right w-[100px]">Comisión</TableHead>}
        <TableHead className="text-center w-[80px]">Estado</TableHead>
        <TableHead className="text-right w-[70px]">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
