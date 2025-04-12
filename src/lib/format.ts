
/**
 * Format utility functions
 */

/**
 * Format a number as currency with Euro symbol and Spanish locale
 * @param amount Number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date for display in Spanish format DD-MM-YYYY
 * @param dateString Date string in any valid format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

/**
 * Format a date for bill items in DD/MM/YYYY format
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export const formatDateForBill = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date for bill:', error);
    return dateString;
  }
};

/**
 * Create a standard transfer description
 * @param date Date string
 * @param serviceType Service type string
 * @param discountPercent Optional discount percentage
 * @returns Formatted description string
 */
export const formatTransferDescription = (
  date: string, 
  serviceType: string, 
  discountPercent?: number
): string => {
  const formattedDate = formatDate(date);
  const serviceTypeText = serviceType === 'transfer' ? 'Traslado' : 'Disposición';
  
  let description = `${formattedDate} | ${serviceTypeText}`;
  
  if (discountPercent) {
    description += ` - descuento de ${discountPercent}%`;
  }
  
  return description;
};
