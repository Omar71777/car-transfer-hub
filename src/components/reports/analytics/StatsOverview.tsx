
import React from 'react';
import { Transfer, Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface StatsOverviewProps {
  transfers: Transfer[];
  expenses: Expense[];
}

export function StatsOverview({ transfers, expenses }: StatsOverviewProps) {
  // Calculate total income, expenses, and commissions
  const totalIncome = transfers.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
  
  // Calculate commissions
  const totalCommissions = transfers.reduce((sum, t) => {
    if (!t.commission) return sum;
    return sum + ((Number(t.price) || 0) * Number(t.commission) / 100);
  }, 0);
  
  // Calculate expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

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
