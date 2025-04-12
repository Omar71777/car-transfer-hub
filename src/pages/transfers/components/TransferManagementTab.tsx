
import React from 'react';
import { TransfersTable } from '@/components/transfers/TransfersTable';
import { Skeleton } from '@/components/ui/skeleton';

interface TransferManagementTabProps {
  transfers: any[];
  loading: boolean;
  onEdit: (transfer: any) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onMarkAsPaid?: (transferId: string) => void;
}

export function TransferManagementTab({
  transfers,
  loading,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onDeleteMultiple,
  onMarkAsPaid
}: TransferManagementTabProps) {
  return (
    <div className="space-y-4 w-full">
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <TransfersTable
          transfers={transfers}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddExpense={onAddExpense}
          onViewSummary={onViewSummary}
          onDeleteMultiple={onDeleteMultiple}
          onMarkAsPaid={onMarkAsPaid}
        />
      )}
    </div>
  );
}
