
import { calculateBasePrice, calculateDiscountAmount } from '@/lib/calculations';
import { generateTransferDescription, generateExtraChargeDescription } from '@/lib/billing/calculationUtils';
import { BillPreview } from '@/types/billing';

/**
 * Prepares bill items array for database insertion
 */
export function prepareBillItems(billId: string, preview: BillPreview) {
  console.log(`Preparing bill items for bill ${billId} with ${preview.items.length} items`);
  
  const billItems = [];
  
  // Process each item from the preview
  for (const item of preview.items) {
    if (!item.transfer || !item.transfer.id) {
      console.error('Missing transfer data in item:', item);
      continue;
    }
    
    // Calculate the original base price (before any discounts)
    const basePrice = calculateBasePrice(item.transfer);
    // Calculate the discount amount separately
    const discountAmount = calculateDiscountAmount(item.transfer);
    // Calculate the final price after discounts
    const finalPrice = basePrice - discountAmount;
    
    // Create the main transfer item
    let description = item.description || generateTransferDescription(item.transfer);
    
    // Add discount information to the description if there is a discount
    if (discountAmount > 0 && !description.includes('Descuento')) {
      const discountInfo = item.transfer.discountType === 'percentage' 
        ? `Descuento: ${item.transfer.discountValue}%` 
        : `Descuento: ${item.transfer.discountValue}€`;
      description += ` (${discountInfo})`;
    }
    
    // For dispo services, quantity is the number of hours and unit price is the hourly rate
    let quantity = 1;
    let unitPrice = basePrice; // Store the original price before discount
    let totalPrice = finalPrice; // Store the final price after discount
    
    if (item.transfer.serviceType === 'dispo' && item.transfer.hours) {
      quantity = Number(item.transfer.hours);
      unitPrice = Number(item.transfer.price); // The hourly rate
      
      // Calculate total price: hours * hourly rate - discount
      const fullPrice = unitPrice * quantity;
      totalPrice = fullPrice - discountAmount;
    }
    
    const mainItem = {
      bill_id: billId,
      transfer_id: item.transfer.id,
      description: description,
      quantity: quantity,
      unit_price: unitPrice, // Original price before discount
      total_price: totalPrice, // Final price after discount
      is_extra_charge: false,
      parent_item_id: null
    };
    
    // Add the main transfer item
    billItems.push(mainItem);
    
    // Create and add extra charges as separate items
    if (item.extraCharges && item.extraCharges.length > 0) {
      console.log(`Adding ${item.extraCharges.length} extra charges for transfer ${item.transfer.id}`);
      
      // Add the extra charges as separate rows
      for (const charge of item.extraCharges) {
        if (!charge.name || !charge.price) {
          console.error('Invalid extra charge:', charge);
          continue;
        }
        
        billItems.push({
          bill_id: billId,
          transfer_id: item.transfer.id,
          description: charge.name,
          quantity: 1,
          unit_price: charge.price,
          total_price: charge.price, // For extra charges, no discount applies
          is_extra_charge: true,
          extra_charge_id: charge.id,
          parent_item_id: null // Will be set after main item is inserted
        });
      }
    }
  }
  
  return billItems;
}
