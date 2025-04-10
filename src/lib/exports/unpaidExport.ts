
import { Transfer } from '@/types';
import { format } from 'date-fns';

/**
 * Prepares unpaid transfer data for export to CSV
 */
export function prepareUnpaidDataForExport(transfers: Transfer[]) {
  return transfers.map(transfer => {
    const commissionAmount = (transfer.price * transfer.commission) / 100;
    const amountToPay = transfer.price - commissionAmount;
    
    return {
      Fecha: transfer.date,
      Colaborador: transfer.collaborator || 'N/A',
      Origen: transfer.origin,
      Destino: transfer.destination,
      Precio: transfer.price.toFixed(2) + '€',
      'Comisión (%)': `${transfer.commission}%`,
      'Importe Comisión': commissionAmount.toFixed(2) + '€',
      'Importe a Pagar': amountToPay.toFixed(2) + '€'
    };
  });
}

/**
 * Prepares monthly summary data for export
 */
export function prepareUnpaidSummaryForExport(monthlyData: {
  collaborator: string;
  month: string;
  transferCount: number;
  total: number;
}[]) {
  return monthlyData.map(data => ({
    Colaborador: data.collaborator,
    Mes: data.month,
    'Número de Transfers': data.transferCount,
    'Total a Pagar': data.total.toFixed(2) + '€'
  }));
}
