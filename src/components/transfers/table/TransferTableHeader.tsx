
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
        <TableHead className="col-date">Fecha</TableHead>
        <TableHead className="col-type">Tipo</TableHead>
        <TableHead className="col-price text-right">Precio</TableHead>
        {!isMobile && <TableHead className="col-client">Cliente</TableHead>}
        {!isMobile && <TableHead className="col-collaborator">Colaborador</TableHead>}
        {!isMobile && <TableHead className="col-commission text-right">Comisión</TableHead>}
        {!isMobile && <TableHead className="col-total text-right">Total</TableHead>}
        <TableHead className="col-status text-center">Estado</TableHead>
        <TableHead className="col-actions text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
