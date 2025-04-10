
import React from 'react';
import { Transfer } from '@/types';

interface TransfersSummaryProps {
  transfers: Transfer[];
}

export function TransfersSummary({ transfers }: TransfersSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Total Transfers</h3>
        <p className="mt-2 text-3xl font-semibold">{transfers.length}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
        <p className="mt-2 text-3xl font-semibold">
          {transfers.reduce((sum, t) => sum + t.price, 0).toFixed(2)}€
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Comisiones Totales</h3>
        <p className="mt-2 text-3xl font-semibold">
          {transfers.reduce((sum, t) => sum + (t.price * t.commission / 100), 0).toFixed(2)}€
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Precio Promedio</h3>
        <p className="mt-2 text-3xl font-semibold">
          {transfers.length > 0 
            ? (transfers.reduce((sum, t) => sum + t.price, 0) / transfers.length).toFixed(2) 
            : 0}€
        </p>
      </div>
    </div>
  );
}
