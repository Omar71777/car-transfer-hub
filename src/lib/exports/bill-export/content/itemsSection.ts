
import { Bill } from '@/types/billing';
import { formatCurrency } from '../utils/formatters';

/**
 * Generates HTML content for bill items
 */
export const generateItemsHtml = (bill: Bill): string => {
  return bill.items.map(item => {
    // Determine if this is a main item or an extra charge
    const isExtraCharge = item.is_extra_charge;
    
    // Main item row
    let html = `
      <tr${isExtraCharge ? ' class="extra-charge-row"' : ''}>
        <td${isExtraCharge ? ' style="padding-left: 20px; font-style: italic; color: #666;"' : ''}>${item.description}</td>
        <td>${item.quantity}</td>
        <td class="text-right">${formatCurrency(item.unit_price)}</td>
        <td class="text-right">${formatCurrency(item.total_price)}</td>
      </tr>
    `;
    
    return html;
  }).join('');
};
