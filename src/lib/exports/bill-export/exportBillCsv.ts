
import { Bill } from '@/types/billing';
import { downloadCSV } from '../csvExport';

/**
 * Exports a bill to CSV format
 */
export const exportBillCsv = (bill: Bill) => {
  const headers = ['Concepto', 'Cantidad', 'Precio unitario', 'Total'];
  
  const rows = bill.items.map(item => {
    // Create the main item row
    const mainRow = [
      item.description,
      item.quantity.toString(),
      item.unit_price.toString(),
      item.total_price.toString()
    ];
    
    // Add extra charge rows if they exist
    const extraRows = item.extra_charges ? item.extra_charges.map(charge => [
      `  ${charge.name}`, // Indent to show hierarchy
      '1',
      charge.price.toString(),
      charge.price.toString()
    ]) : [];
    
    return [mainRow, ...extraRows];
  }).flat(); // Flatten the nested arrays
  
  // Añadir filas de resumen
  rows.push(['', '', 'Subtotal', bill.sub_total.toString()]);
  rows.push(['', '', `IVA (${bill.tax_rate}%)`, bill.tax_amount.toString()]);
  rows.push(['', '', 'Total', bill.total.toString()]);
  
  const fileName = `factura-${bill.number}.csv`;
  downloadCSV(headers, rows, fileName);
};
