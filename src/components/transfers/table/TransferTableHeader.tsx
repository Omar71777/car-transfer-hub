
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Checkbox } from '@/components/ui/checkbox';

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
          <Checkbox 
            checked={allSelected} 
            onCheckedChange={onSelectAll}
            aria-label="Select all"
            className="text-center"
            ref={el => {
              if (el) {
                if (someSelected && !allSelected) {
                  el.indeterminate = true;
                } else {
                  el.indeterminate = false;
                }
              }
            }}
          />
        </TableHead>
        <TableHead>{capitalizeFirstLetter('fecha')}</TableHead>
        {!isMobile && <TableHead>{capitalizeFirstLetter('hora')}</TableHead>}
        <TableHead>{capitalizeFirstLetter('origen')}</TableHead>
        <TableHead>{capitalizeFirstLetter('destino')}</TableHead>
        <TableHead className="text-right">{capitalizeFirstLetter('precio')}</TableHead>
        {!isMobile && <TableHead>{capitalizeFirstLetter('colaborador')}</TableHead>}
        {!isMobile && <TableHead className="text-right">{capitalizeFirstLetter('comisión')}</TableHead>}
        <TableHead className="text-center">{capitalizeFirstLetter('estado')}</TableHead>
        <TableHead className="text-center">{capitalizeFirstLetter('acciones')}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
