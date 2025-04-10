
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function BillTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Número</TableHead>
        <TableHead>Cliente</TableHead>
        <TableHead>Fecha</TableHead>
        <TableHead>Vencimiento</TableHead>
        <TableHead>Total</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead className="text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
