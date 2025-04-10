
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { RowCheckbox } from '@/components/ui/row-checkbox';

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
        <TableHead className="w-[50px] px-2">
          {onSelectAll && (
            <RowCheckbox 
              id="select-all"
              checked={allSelected}
              onChange={onSelectAll}
              indeterminate={someSelected && !allSelected}
            />
          )}
        </TableHead>
        <TableHead>{capitalizeFirstLetter('fecha')}</TableHead>
        {!isMobile && <TableHead>{capitalizeFirstLetter('hora')}</TableHead>}
        <TableHead>{capitalizeFirstLetter('origen')}</TableHead>
        <TableHead>{capitalizeFirstLetter('destino')}</TableHead>
        <TableHead className="text-right">{capitalizeFirstLetter('precio')}</TableHead>
        {!isMobile && <TableHead>{capitalizeFirstLetter('cliente')}</TableHead>}
        {!isMobile && <TableHead>{capitalizeFirstLetter('colaborador')}</TableHead>}
        {!isMobile && <TableHead className="text-right">{capitalizeFirstLetter('comisión')}</TableHead>}
        <TableHead className="text-center">{capitalizeFirstLetter('estado')}</TableHead>
        <TableHead className="text-center">{capitalizeFirstLetter('acciones')}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
