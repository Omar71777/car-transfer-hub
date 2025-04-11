
import { Bill } from '@/types/billing';
import { formatCurrency } from '../utils/formatters';

/**
 * Generates HTML content for bill items
 */
export const generateItemsHtml = (bill: Bill): string => {
  if (!bill.items || bill.items.length === 0) {
    return `
      <tr>
        <td colspan="4" class="text-center py-5 text-muted-color">No hay elementos en esta factura</td>
      </tr>
    `;
  }

  // Debug the items being rendered
  console.log('Generating HTML for bill items:', bill.items.length, 'items');

  return bill.items.map(item => {
    // Determine if this is a main item or an extra charge
    const isExtraCharge = item.is_extra_charge;
    
    // Main item row with updated styling
    return `
      <tr class="${isExtraCharge ? 'extra-charge-row' : ''}">
        <td class="${isExtraCharge ? 'pl-8 text-muted-color italic font-light' : 'font-medium'}">
          ${item.description || 'Sin descripción'}
        </td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">${formatCurrency(item.unit_price)}</td>
        <td class="text-right font-medium">${formatCurrency(item.total_price)}</td>
      </tr>
    `;
  }).join('');
};
