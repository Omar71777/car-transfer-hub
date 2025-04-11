
import React from 'react';
import { Expense } from '@/types';

interface ExpensesSectionProps {
  expenses: Expense[];
  formatCurrency: (amount: number) => string;
}

export function ExpensesSection({ expenses, formatCurrency }: ExpensesSectionProps) {
  if (!expenses || expenses.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-medium text-lg">Gastos asociados</h3>
      <div className="mt-2 space-y-2">
        <div className="grid grid-cols-3 gap-2 font-medium text-sm">
          <div>Fecha</div>
          <div>Concepto</div>
          <div className="text-right">Importe</div>
        </div>
        {expenses.map((expense) => (
          <div key={expense.id} className="grid grid-cols-3 gap-2 text-sm">
            <div>{expense.date}</div>
            <div>{expense.concept}</div>
            <div className="text-right">{formatCurrency(expense.amount)}</div>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2 font-medium pt-2 border-t">
          <div></div>
          <div>Total gastos:</div>
          <div className="text-right">
            {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
          </div>
        </div>
      </div>
    </div>
  );
}
