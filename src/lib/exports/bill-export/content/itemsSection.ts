
import { Bill } from '@/types/billing';
import { formatCurrency } from '../utils/formatters';

/**
 * Generates HTML content for bill items
 */
export const generateItemsHtml = (bill: Bill): string => {
  if (!bill.items || bill.items.length === 0) {
    return `
      <tr>
        <td colspan="4" class="text-center py-4">No hay elementos en esta factura</td>
      </tr>
    `;
  }

  // Debug the items being rendered
  console.log('Generating HTML for bill items:', bill.items.length, 'items');

  return bill.items.map(item => {
    // Determine if this is a main item or an extra charge
    const isExtraCharge = item.is_extra_charge;
    
    // Main item row
    return `
      <tr class="${isExtraCharge ? 'extra-charge-row' : ''}">
        <td class="${isExtraCharge ? 'pl-6 text-muted-foreground italic' : 'font-medium'}">${item.description || 'Sin descripción'}</td>
        <td>${item.quantity}</td>
        <td class="text-right">${formatCurrency(item.unit_price)}</td>
        <td class="text-right">${formatCurrency(item.total_price)}</td>
      </tr>
    `;
  }).join('');
};
