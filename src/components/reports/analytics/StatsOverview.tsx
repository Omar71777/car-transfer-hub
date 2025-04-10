
import React from 'react';
import { Transfer } from '@/types';
import { Expense } from '@/types';

interface StatsOverviewProps {
  transfers: Transfer[];
  expenses: Expense[];
}

export function StatsOverview({ transfers, expenses }: StatsOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Total Transfers</h3>
        <p className="mt-2 text-2xl font-semibold">{transfers.length}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
        <p className="mt-2 text-2xl font-semibold">
          {transfers.reduce((sum, t) => sum + t.price, 0).toFixed(2)}€
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500">Gastos Totales</h3>
        <p className="mt-2 text-2xl font-semibold">
          {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}€
        </p>
      </div>
    </div>
  );
}
