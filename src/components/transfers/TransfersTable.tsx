
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Transfer } from '@/types';
import { TransferTableHeader } from './table/TransferTableHeader';
import { TransferTableRow } from './table/TransferTableRow';
import { EmptyTransfersRow } from './table/EmptyTransfersRow';

interface TransfersTableProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
}

export function TransfersTable({
  transfers,
  onEdit,
  onDelete,
  onAddExpense
}: TransfersTableProps) {
  return (
    <div className="rounded-md border overflow-hidden glass-card px-[7px]">
      <Table>
        <TransferTableHeader />
        <TableBody>
          {transfers.length === 0 ? (
            <EmptyTransfersRow />
          ) : (
            transfers.map(transfer => (
              <TransferTableRow
                key={transfer.id}
                transfer={transfer}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddExpense={onAddExpense}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
