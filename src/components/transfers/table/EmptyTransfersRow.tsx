
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function EmptyTransfersRow() {
  const isMobile = useIsMobile();
  
  return (
    <TableRow>
      <TableCell colSpan={isMobile ? 7 : 10} className="text-center py-8 text-muted-foreground">
        {capitalizeFirstLetter('no hay transfers registrados')}
      </TableCell>
    </TableRow>
  );
}
