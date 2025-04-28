
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Transfer } from '@/types';

interface TransferServiceDetailsProps {
  transfer: Transfer;
}

export function TransferServiceDetails({ transfer }: TransferServiceDetailsProps) {
  const formatTransferDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString || 'Fecha inválida';
    }
  };

  // Handle potential missing or invalid data safely
  const formattedDate = transfer.date ? formatTransferDate(transfer.date) : 'Fecha no disponible';
  const hasDispoHours = transfer.serviceType === 'dispo' && 
                       transfer.hours !== undefined && 
                       transfer.hours !== null;

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
      <div className="flex items-center col-span-2 text-slate-700 font-medium">
        <div>{formattedDate}</div>
        {transfer.time && (
          <div className="ml-2">{transfer.time}</div>
        )}
        {hasDispoHours && (
          <div className="ml-2 text-primary-600">{transfer.hours}h</div>
        )}
      </div>
      
      <div className="col-span-2 mt-1">
        <div className="grid grid-cols-2 gap-x-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Origen:</p>
            <p className="text-xs text-slate-800 font-medium truncate">
              {transfer.origin || 'No especificado'}
            </p>
          </div>
          {transfer.serviceType === 'transfer' && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Destino:</p>
              <p className="text-xs text-slate-800 font-medium truncate">
                {transfer.destination || 'No especificado'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
