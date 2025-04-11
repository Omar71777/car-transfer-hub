
import React from 'react';
import { Transfer } from '@/types';
import { Expense } from '@/types';
import { calculateTotalPrice, calculateCommissionAmount } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';

interface StatsOverviewProps {
  transfers: Transfer[];
  expenses: Expense[];
}

export function StatsOverview({ transfers, expenses }: StatsOverviewProps) {
  const totalIncome = transfers.reduce((sum, t) => sum + calculateTotalPrice(t), 0);
  const totalCommissions = transfers.reduce((sum, t) => sum + calculateCommissionAmount(t), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-700">Total Transfers</h3>
        <p className="mt-2 text-2xl font-semibold">{transfers.length}</p>
      </div>
      <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-700">Ingresos Totales</h3>
        <p className="mt-2 text-2xl font-semibold">
          {formatCurrency(totalIncome)}
        </p>
      </div>
      <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-red-700">Gastos Totales</h3>
        <p className="mt-2 text-2xl font-semibold">
          {formatCurrency(totalExpenses + totalCommissions)}
        </p>
      </div>
    </div>
  );
}
