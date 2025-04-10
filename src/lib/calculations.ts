
import { Transfer, ExtraCharge } from '@/types';

/**
 * Calculates the base price for a transfer, taking into account service type (dispo multiplies by hours)
 */
export const calculateBasePrice = (transfer: Transfer): number => {
  if (!transfer) return 0;
  
  const price = Number(transfer.price) || 0;
  
  // For dispo service, multiply price by hours
  if (transfer.serviceType === 'dispo' && transfer.hours) {
    return price * Number(transfer.hours);
  }
  
  return price;
};

/**
 * Calculates total extra charges for a transfer
 */
export const calculateExtraChargesTotal = (extraCharges: ExtraCharge[] = []): number => {
  return extraCharges.reduce((sum, charge) => {
    const chargePrice = typeof charge.price === 'string' ? Number(charge.price) : (charge.price || 0);
    return sum + chargePrice;
  }, 0);
};

/**
 * Calculates the discount amount based on discount type and value
 */
export const calculateDiscountAmount = (transfer: Transfer): number => {
  if (!transfer.discountType || !transfer.discountValue) return 0;
  
  const basePrice = calculateBasePrice(transfer);
  
  if (transfer.discountType === 'percentage') {
    return basePrice * (Number(transfer.discountValue) / 100);
  } else {
    return Number(transfer.discountValue);
  }
};

/**
 * Calculates the commission amount based on commission type and value
 */
export const calculateCommissionAmount = (transfer: Transfer): number => {
  if (!transfer.commission) return 0;
  
  const totalPriceBeforeCommission = calculateTotalPrice(transfer);
  
  if (transfer.commissionType === 'percentage') {
    return totalPriceBeforeCommission * (Number(transfer.commission) / 100);
  } else {
    return Number(transfer.commission);
  }
};

/**
 * Calculates the total price including extra charges and discounts
 */
export const calculateTotalPrice = (transfer: Transfer): number => {
  if (!transfer) return 0;
  
  const basePrice = calculateBasePrice(transfer);
  const extraChargesTotal = calculateExtraChargesTotal(transfer.extraCharges);
  const discountAmount = calculateDiscountAmount(transfer);
  
  return basePrice + extraChargesTotal - discountAmount;
};
