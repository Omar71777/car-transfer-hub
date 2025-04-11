
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
      <TableRow className="bg-gray-800 text-white">
        <TableHead className="w-[36px] px-1 text-center">
          {onSelectAll && (
            <Checkbox 
              id="select-all"
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
              className="text-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
              data-state={someSelected && !allSelected ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked')}
            />
          )}
        </TableHead>
        <TableHead className="col-date text-center text-xs font-bold">Fecha</TableHead>
        <TableHead className="col-type text-center text-xs font-bold">Tipo</TableHead>
        <TableHead className="col-price text-right text-xs font-bold">Precio</TableHead>
        {!isMobile && <TableHead className="col-client text-center text-xs font-bold">Cliente</TableHead>}
        {!isMobile && <TableHead className="col-collaborator text-center text-xs font-bold">Colaborador</TableHead>}
        {!isMobile && <TableHead className="col-commission text-right text-xs font-bold">Comisión</TableHead>}
        {!isMobile && <TableHead className="col-total text-right text-xs font-bold">Total</TableHead>}
        <TableHead className="col-status text-center text-xs font-bold">Estado</TableHead>
        <TableHead className="col-actions text-center text-xs font-bold">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
