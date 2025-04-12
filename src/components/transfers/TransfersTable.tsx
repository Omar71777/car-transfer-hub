
import React, { useState, useMemo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Transfer } from '@/types';
import { TransferTableHeader } from './table/TransferTableHeader';
import { TransferTableRow } from './table/TransferTableRow';
import { EmptyTransfersRow } from './table/EmptyTransfersRow';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransferTableFilters } from './table/TransferTableFilters';
import { TransferCardView } from './table/TransferCardView';

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
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>(transfers);
  const isMobile = useIsMobile();
  
  // Update filtered transfers when transfers prop changes
  React.useEffect(() => {
    setFilteredTransfers(transfers);
  }, [transfers]);

  const handleSelectRow = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };
  
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(filteredTransfers.map(transfer => transfer.id));
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

  const handleFilterChange = (newFilteredTransfers: Transfer[]) => {
    setFilteredTransfers(newFilteredTransfers);
    // Clear selected rows when filters change
    setSelectedRows([]);
  };
  
  return (
    <div className="space-y-2 w-full">
      <TransferTableFilters 
        transfers={transfers} 
        onFilterChange={handleFilterChange} 
      />

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

      {isMobile ? (
        <TransferCardView
          transfers={filteredTransfers}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddExpense={onAddExpense}
          onViewSummary={onViewSummary}
          onSelectRow={handleSelectRow}
          selectedRows={selectedRows}
        />
      ) : (
        <div className="table-container bg-card rounded-md border shadow-sm mx-auto">
          <div className="table-full-width">
            <Table className="w-full table-fixed">
              <TransferTableHeader 
                onSelectAll={handleSelectAll} 
                allSelected={selectedRows.length === filteredTransfers.length && filteredTransfers.length > 0}
                someSelected={selectedRows.length > 0 && selectedRows.length < filteredTransfers.length}
              />
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <EmptyTransfersRow />
                ) : (
                  filteredTransfers.map(transfer => (
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
      )}
    </div>
  );
}
