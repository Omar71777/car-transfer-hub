
import React from 'react';
import { Expense } from '@/types';
import { Card } from '@/components/ui/card';
import { SeparatorLine } from './SeparatorLine';

interface ExpensesSectionProps {
  expenses: Expense[];
  formatCurrency: (amount: number) => string;
}

export function ExpensesSection({ expenses, formatCurrency }: ExpensesSectionProps) {
  if (!expenses || expenses.length === 0) {
    return null;
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="p-4 mt-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
      <h3 className="font-semibold text-lg mb-2">Gastos asociados</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 font-medium text-sm bg-muted/30 p-2 rounded-md">
          <div>Fecha</div>
          <div>Concepto</div>
          <div className="text-right">Importe</div>
        </div>
        
        <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1">
          {expenses.map((expense) => (
            <div 
              key={expense.id} 
              className="grid grid-cols-3 gap-2 text-sm p-2 hover:bg-muted/20 rounded-md transition-colors"
            >
              <div>{expense.date}</div>
              <div>{expense.concept}</div>
              <div className="text-right font-medium">{formatCurrency(expense.amount)}</div>
            </div>
          ))}
        </div>
        
        <SeparatorLine />
        
        <div className="grid grid-cols-3 gap-2 font-medium pt-2">
          <div></div>
          <div>Total gastos:</div>
          <div className="text-right text-primary">
            {formatCurrency(totalExpenses)}
          </div>
        </div>
      </div>
    </Card>
  );
}
