
import React from 'react';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/format';

interface TransferCollaboratorInfoProps {
  transfer: Transfer;
}

export function TransferCollaboratorInfo({ transfer }: TransferCollaboratorInfoProps) {
  // Safe check for valid collaborator data
  if (!transfer.collaborator || transfer.collaborator === 'none') {
    return null;
  }

  // Safely handle missing commission values
  const hasCommission = transfer.collaborator !== 'servicio propio' && 
                       transfer.commission !== undefined && 
                       transfer.commission !== null;

  return (
    <div className="col-span-2 mt-1">
      <p className="text-xs font-medium text-muted-foreground inline mr-1">Colaborador:</p>
      <p className="text-xs font-medium text-indigo-600 inline">
        {transfer.collaborator}
        {hasCommission && (
          <span className="ml-2 text-slate-600">
            ({transfer.commissionType === 'percentage' 
              ? `${transfer.commission}%` 
              : formatCurrency(Number(transfer.commission))})
          </span>
        )}
      </p>
    </div>
  );
}
