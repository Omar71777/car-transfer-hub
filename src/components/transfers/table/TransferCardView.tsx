
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Transfer } from '@/types';
import { TransferCardBadges } from './card-components/TransferCardBadges';
import { TransferServiceDetails } from './card-components/TransferServiceDetails';
import { TransferPriceInfo } from './card-components/TransferPriceInfo';
import { TransferCollaboratorInfo } from './card-components/TransferCollaboratorInfo';
import { TransferExtraCharges } from './card-components/TransferExtraCharges';
import { TransferRowActions } from './TransferRowActions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle } from 'lucide-react';

interface TransferCardViewProps {
  transfers: Transfer[];
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onSelectRow?: (id: string, selected: boolean) => void;
  onMarkAsPaid?: (transferId: string, newStatus?: 'paid' | 'pending') => void;
  onMarkAsBilled?: (transferId: string) => void;
  selectedRows?: string[];
  isLoading?: boolean;
  error?: string | null;
}

export function TransferCardView({
  transfers,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onSelectRow,
  onMarkAsPaid,
  selectedRows = [],
  isLoading = false,
  error = null
}: TransferCardViewProps) {
  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-center flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Error al cargar los transfers: {error}</p>
      </div>
    );
  }

  // Show empty state
  if (transfers.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No hay transfers para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transfers.map((transfer) => (
        <Card 
          key={transfer.id} 
          className="overflow-hidden transition-all hover:border-primary/40"
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <TransferCardBadges
                transfer={transfer}
                onSelectRow={onSelectRow}
                onMarkAsPaid={onMarkAsPaid}
                isSelected={selectedRows.includes(transfer.id)}
              />
              <TransferRowActions
                transferId={transfer.id}
                isMobile={true}
                onEdit={() => onEdit(transfer)}
                onDelete={() => onDelete(transfer.id)}
                onAddExpense={() => onAddExpense(transfer.id)}
                onViewSummary={() => onViewSummary(transfer.id)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <TransferServiceDetails transfer={transfer} />
              <TransferPriceInfo transfer={transfer} />
              <TransferCollaboratorInfo transfer={transfer} />
              <TransferExtraCharges extraCharges={transfer.extraCharges} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
