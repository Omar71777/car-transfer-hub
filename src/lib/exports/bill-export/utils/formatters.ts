
/**
 * Utility functions for formatting values in bill content
 */

/**
 * Formats currency values
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};
