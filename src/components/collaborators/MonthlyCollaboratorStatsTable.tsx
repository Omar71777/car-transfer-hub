
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { MonthlyCollaboratorStats } from './types';

interface MonthlyCollaboratorStatsTableProps {
  monthlyStats: MonthlyCollaboratorStats[];
}

export function MonthlyCollaboratorStatsTable({ monthlyStats }: MonthlyCollaboratorStatsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mes</TableHead>
          <TableHead>Colaborador</TableHead>
          <TableHead className="text-right">Cantidad de Transfers</TableHead>
          <TableHead className="text-right">Total Comisión</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {monthlyStats.map((stat, index) => (
          <TableRow key={`${stat.month}-${stat.collaborator}-${index}`}>
            <TableCell>{stat.month}</TableCell>
            <TableCell>{stat.collaborator}</TableCell>
            <TableCell className="text-right">{stat.transferCount}</TableCell>
            <TableCell className="text-right font-medium text-amber-500">
              {formatCurrency(stat.commissionTotal)}
            </TableCell>
          </TableRow>
        ))}
        {monthlyStats.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              No hay datos mensuales disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
