
import React from 'react';
import { Transfer } from '@/types';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';

interface TransfersSummaryProps {
  transfers: Transfer[];
}

export function TransfersSummary({ transfers }: TransfersSummaryProps) {
  const totalIncome = transfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);
  const totalCommissions = transfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);
  const averagePrice = transfers.length > 0 ? totalIncome / transfers.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Total Transfers</h3>
        <p className="mt-2 text-3xl font-semibold">{transfers.length}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
        <p className="mt-2 text-3xl font-semibold">
          {totalIncome.toFixed(2)}€
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Comisiones Totales</h3>
        <p className="mt-2 text-3xl font-semibold">
          {totalCommissions.toFixed(2)}€
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Precio Promedio</h3>
        <p className="mt-2 text-3xl font-semibold">
          {averagePrice.toFixed(2)}€
        </p>
      </div>
    </div>
  );
}
