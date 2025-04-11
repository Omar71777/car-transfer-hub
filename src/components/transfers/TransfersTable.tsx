
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Transfer } from '@/types';
import { TransferTableHeader } from './table/TransferTableHeader';
import { TransferTableRow } from './table/TransferTableRow';
import { EmptyTransfersRow } from './table/EmptyTransfersRow';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransfersTableProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onDeleteMultiple?: (ids: string[]) => void;
}

export function TransfersTable({
  transfers,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onDeleteMultiple = (ids) => ids.forEach(onDelete)
}: TransfersTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const handleSelectRow = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };
  
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(transfers.map(transfer => transfer.id));
    } else {
      setSelectedRows([]);
    }
  };
  
  const handleDeleteSelected = () => {
    if (selectedRows.length > 0) {
      onDeleteMultiple(selectedRows);
      setSelectedRows([]);
    }
  };
  
  return (
    <div className="space-y-2 w-full">
      {selectedRows.length > 0 && (
        <div className="flex justify-between items-center p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedRows.length} {selectedRows.length === 1 ? 'elemento' : 'elementos'} seleccionados
          </span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelected}
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      )}
      <div className="w-full border rounded-md">
        <div className="w-full">
          <Table className={isMobile ? "mobile-table w-full table-fixed" : "w-full table-fixed"}>
            <TransferTableHeader 
              onSelectAll={handleSelectAll} 
              allSelected={selectedRows.length === transfers.length && transfers.length > 0}
              someSelected={selectedRows.length > 0 && selectedRows.length < transfers.length}
            />
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
                    onViewSummary={onViewSummary}
                    selected={selectedRows.includes(transfer.id)}
                    onSelectRow={handleSelectRow}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
