
/**
 * Calculations utility for transfers and billing
 */

export interface MinimalTransfer {
  serviceType: 'transfer' | 'dispo';
  price: number;
  hours?: number | string;
  discountType?: 'percentage' | 'fixed' | null;
  discountValue?: number;
  extraCharges?: { price: number }[];
}

/**
 * Calculate the base price of a transfer before discounts
 * @param transfer Transfer object with price and hours info
 * @returns Base price (price * hours for dispo, just price for transfer)
 */
export const calculateBasePrice = (transfer: MinimalTransfer): number => {
  if (transfer.serviceType === 'dispo' && transfer.hours) {
    const hours = typeof transfer.hours === 'string' ? parseFloat(transfer.hours) : transfer.hours;
    return transfer.price * (isNaN(hours) ? 1 : hours);
  }
  return transfer.price;
};

/**
 * Calculate the total price of a transfer including discounts and extra charges
 * @param transfer Transfer object
 * @returns Total price after all calculations
 */
export const calculateTotalPrice = (transfer: MinimalTransfer): number => {
  const basePrice = calculateBasePrice(transfer);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (transfer.discountType && transfer.discountValue) {
    if (transfer.discountType === 'percentage') {
      discountAmount = basePrice * (transfer.discountValue / 100);
    } else if (transfer.discountType === 'fixed') {
      discountAmount = transfer.discountValue;
    }
  }
  
  // Sum up extra charges
  const extraChargesTotal = (transfer.extraCharges || []).reduce((sum, charge) => {
    return sum + (typeof charge.price === 'number' ? charge.price : 0);
  }, 0);
  
  // Calculate final price
  return basePrice - discountAmount + extraChargesTotal;
};
