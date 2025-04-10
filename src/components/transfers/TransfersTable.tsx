
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TransfersTableProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
}

export function TransfersTable({ transfers, onEdit, onDelete, onAddExpense }: TransfersTableProps) {
  return (
    <div className="rounded-md border overflow-hidden glass-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead>Colaborador</TableHead>
            <TableHead className="text-right">Comisión</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No hay transfers registrados
              </TableCell>
            </TableRow>
          ) : (
            transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.date}</TableCell>
                <TableCell>{transfer.time}</TableCell>
                <TableCell>{transfer.origin}</TableCell>
                <TableCell>{transfer.destination}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(transfer.price)}</TableCell>
                <TableCell>{transfer.collaborator}</TableCell>
                <TableCell className="text-right">{transfer.commission}%</TableCell>
                <TableCell className="text-center">
                  {transfer.paymentStatus === 'paid' ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Cobrado</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Pendiente</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(transfer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(transfer.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onAddExpense(transfer.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
