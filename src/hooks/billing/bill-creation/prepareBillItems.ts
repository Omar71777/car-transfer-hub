
import { calculateBasePrice, calculateDiscountAmount } from '@/lib/calculations';
import { BillPreview } from '@/types/billing';

/**
 * Creates a main transfer item for the bill
 */
function createMainTransferItem(
  billId: string,
  transferId: string,
  description: string,
  quantity: number,
  unitPrice: number,
  totalPrice: number
) {
  return {
    bill_id: billId,
    transfer_id: transferId,
    description: description,
    quantity: quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    is_extra_charge: false,
    parent_item_id: null
  };
}

/**
 * Creates an extra charge item for the bill
 */
function createExtraChargeItem(
  billId: string,
  transferId: string,
  chargeName: string,
  chargePrice: number,
  chargeId?: string
) {
  return {
    bill_id: billId,
    transfer_id: transferId,
    description: chargeName,
    quantity: 1,
    unit_price: chargePrice,
    total_price: chargePrice, // For extra charges, no discount applies
    is_extra_charge: true,
    extra_charge_id: chargeId,
    parent_item_id: null // Will be set after main item is inserted
  };
}

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
function formatDateForDisplay(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    // Return original if formatting fails
    return dateString;
  }
}

/**
 * Generates description for a transfer item based on service type and discount
 */
function generateItemDescription(transfer: any, discountAmount: number): string {
  // Create the base description
  let description = transfer.description;
  
  if (!description) {
    // If no description provided, generate one based on service type
    if (transfer.serviceType === 'dispo') {
      description = `${formatDateForDisplay(transfer.date)}, Servicio de disposición por horas`;
    } else {
      description = `${formatDateForDisplay(transfer.date)}, Traslado: ${transfer.origin} → ${transfer.destination}`;
    }
  }
  
  // Add discount information if applicable
  if (discountAmount > 0 && !description.includes('Descuento')) {
    const discountInfo = transfer.discountType === 'percentage' 
      ? `Descuento: ${transfer.discountValue}%` 
      : `Descuento: ${transfer.discountValue}€`;
    description += ` (${discountInfo})`;
  }
  
  return description;
}

/**
 * Calculates quantity and prices for transfer items
 */
function calculateItemPricing(transfer: any, basePrice: number, discountAmount: number) {
  // Default values
  let quantity = 1;
  let unitPrice = basePrice; // Store the original price before discount
  let totalPrice = basePrice - discountAmount; // Store the final price after discount

  // For dispo services, quantity is the number of hours and unit price is the hourly rate
  if (transfer.serviceType === 'dispo' && transfer.hours) {
    quantity = Number(transfer.hours);
    unitPrice = Number(transfer.price); // The hourly rate
    
    // Calculate total price: hours * hourly rate - discount
    const fullPrice = unitPrice * quantity;
    totalPrice = fullPrice - discountAmount;
  }
  
  return { quantity, unitPrice, totalPrice };
}

/**
 * Creates bill items for a single transfer and its extra charges
 */
function createBillItemsForTransfer(billId: string, item: any) {
  const billItems = [];
  
  if (!item.transfer || !item.transfer.id) {
    console.error('Missing transfer data in item:', item);
    return billItems;
  }
  
  // Calculate pricing components
  const basePrice = calculateBasePrice(item.transfer);
  const discountAmount = calculateDiscountAmount(item.transfer);
  
  // Generate description
  const description = generateItemDescription(item.transfer, discountAmount);
  
  // Calculate pricing details (quantity, unit price, total price)
  const { quantity, unitPrice, totalPrice } = calculateItemPricing(
    item.transfer, 
    basePrice, 
    discountAmount
  );
  
  // Create and add the main transfer item
  const mainItem = createMainTransferItem(
    billId,
    item.transfer.id,
    description,
    quantity,
    unitPrice,
    totalPrice
  );
  
  billItems.push(mainItem);
  
  // Add extra charges if they exist
  if (item.extraCharges && item.extraCharges.length > 0) {
    console.log(`Adding ${item.extraCharges.length} extra charges for transfer ${item.transfer.id}`);
    
    // Add each extra charge as a separate item
    for (const charge of item.extraCharges) {
      if (!charge.name || !charge.price) {
        console.error('Invalid extra charge:', charge);
        continue;
      }
      
      const extraChargeItem = createExtraChargeItem(
        billId,
        item.transfer.id,
        charge.name,
        charge.price,
        charge.id
      );
      
      billItems.push(extraChargeItem);
    }
  }
  
  return billItems;
}

/**
 * Prepares bill items array for database insertion
 */
export function prepareBillItems(billId: string, preview: BillPreview) {
  console.log(`Preparing bill items for bill ${billId} with ${preview.items.length} items`);
  
  let allBillItems = [];
  
  // Process each item from the preview
  for (const item of preview.items) {
    const itemsForTransfer = createBillItemsForTransfer(billId, item);
    allBillItems = [...allBillItems, ...itemsForTransfer];
  }
  
  return allBillItems;
}
