
import React from 'react';
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/format';

interface TransferCollaboratorInfoProps {
  transfer: Transfer;
}

export function TransferCollaboratorInfo({ transfer }: TransferCollaboratorInfoProps) {
  if (!transfer.collaborator || transfer.collaborator === 'none') {
    return null;
  }

  return (
    <div className="col-span-2 mt-1">
      <p className="text-xs font-medium text-muted-foreground inline mr-1">Colaborador:</p>
      <p className="text-xs font-medium text-indigo-600 inline">
        {transfer.collaborator}
        {transfer.collaborator !== 'servicio propio' && 
         transfer.commission && (
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
