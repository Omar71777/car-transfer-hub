
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

export function BillTableHeader() {
  const isMobile = useIsMobile();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Número</TableHead>
        <TableHead>Cliente</TableHead>
        <TableHead>Fecha</TableHead>
        {!isMobile && <TableHead>Vencimiento</TableHead>}
        <TableHead>Total</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead className="text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
