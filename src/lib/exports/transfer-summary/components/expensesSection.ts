
import { Transfer } from '@/types';
import { formatDate } from '../utils';
import { formatCurrency } from '@/lib/utils';

/**
 * Generates the HTML for the expenses section
 */
export function renderExpensesSection(transfer: Transfer): string {
  if (!transfer.expenses || transfer.expenses.length === 0) return '';
  
  const totalExpenses = transfer.expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  
  return `
  <div class="card">
    <h2>Gastos Asociados</h2>
    <div>
      <div class="expenses-header">
        <div>Fecha</div>
        <div>Concepto</div>
        <div class="text-right">Importe</div>
      </div>
      
      <div style="max-height: 220px; overflow-y: auto;">
        ${transfer.expenses.map(expense => `
        <div class="expense-row">
          <div>${formatDate(expense.date)}</div>
          <div>${expense.concept}</div>
          <div class="text-right">${formatCurrency(expense.amount)}</div>
        </div>
        `).join('')}
      </div>
      
      <div class="separator"></div>
      
      <div class="flex-between total-row">
        <div>Total gastos:</div>
        <div class="text-primary">${formatCurrency(totalExpenses)}</div>
      </div>
    </div>
  </div>
  `;
}
