
import { Bill } from '@/types/billing';
import { formatCurrency } from '../utils/formatters';

/**
 * Formats an item description for the bill 
 */
const formatItemDescription = (item: any): string => {
  // If it's an extra charge, keep the original description
  if (item.is_extra_charge) {
    return item.description;
  }
  
  // Try to extract date and service type
  const transferMatch = item.description.match(/Transfer: (.+)/i);
  const dispoMatch = item.description.match(/Disposición: (.+)/i);
  const dateMatch = item.description.match(/(\d{2}\/\d{2}\/\d{4})/);
  
  if (transferMatch || dispoMatch) {
    const serviceType = transferMatch ? "Transfer" : "Disposición";
    const date = dateMatch ? dateMatch[0] : "";
    
    return `${serviceType} - ${date}`;
  }
  
  return item.description;
};

/**
 * Calculates discount for an item
 */
const calculateDiscount = (item: any): number => {
  if (item.is_extra_charge) return 0;
  
  // For regular items, unit_price is the original price before discount
  // and total_price is the final price after discount (quantity * unit_price - discount)
  // So discount = (unit_price * quantity) - total_price
  const fullPrice = item.unit_price * item.quantity;
  const discount = fullPrice - item.total_price;
  
  return discount > 0 ? discount : 0;
};

/**
 * Generates HTML content for bill items
 */
export const generateItemsHtml = (bill: Bill): string => {
  if (!bill.items || bill.items.length === 0) {
    return `
      <tr>
        <td colspan="5" class="text-center py-5 text-muted-color">No hay elementos en esta factura</td>
      </tr>
    `;
  }

  // Debug the items being rendered
  console.log('Generating HTML for bill items:', bill.items.length, 'items');

  return bill.items.map(item => {
    // Determine if this is a main item or an extra charge
    const isExtraCharge = item.is_extra_charge;
    const discount = calculateDiscount(item);
    const description = isExtraCharge ? item.description : formatItemDescription(item);
    
    // Main item row with updated styling
    return `
      <tr class="${isExtraCharge ? 'extra-charge-row' : ''}">
        <td class="${isExtraCharge ? 'pl-8 text-muted-color italic font-light' : 'font-medium'}">
          ${description || 'Sin descripción'}
        </td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">${formatCurrency(item.unit_price)}</td>
        <td class="text-right">${discount > 0 ? formatCurrency(discount) : '-'}</td>
        <td class="text-right font-medium">${formatCurrency(item.total_price)}</td>
      </tr>
    `;
  }).join('');
};
