
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function TransferTableHeader() {
  const isMobile = useIsMobile();
  
  return (
    <TableHeader>
      <TableRow>
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
