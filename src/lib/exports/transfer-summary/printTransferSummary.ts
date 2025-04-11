
import { Transfer } from '@/types';
import { calculateCommissionAmount, calculateTotalPrice } from '@/lib/calculations';

// Import component renderers
import { getTransferSummaryStyles, formatDate } from './utils';
import { renderClientSection } from './components/clientSection';
import { renderServiceDetailsSection } from './components/serviceDetailsSection';
import { renderCollaboratorSection } from './components/collaboratorSection';
import { renderExpensesSection } from './components/expensesSection';
import { renderPricingDetailsSection } from './components/pricingDetailsSection';

/**
 * Prints a transfer summary in a new window
 */
export function printTransferSummary(transfer: Transfer) {
  if (!transfer) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir el resumen');
    return;
  }

  // Calculate financial data
  const basePrice = transfer.serviceType === 'dispo'
    ? Number(transfer.price) * Number(transfer.hours || 1)
    : Number(transfer.price);
  
  // Calculate extras total
  const validExtraCharges = transfer.extraCharges || [];
  const totalExtraCharges = validExtraCharges.reduce((sum, charge) => {
    return sum + (typeof charge.price === 'number' ? charge.price : Number(charge.price) || 0);
  }, 0);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (transfer.discountType && transfer.discountValue) {
    if (transfer.discountType === 'percentage') {
      discountAmount = basePrice * (Number(transfer.discountValue) / 100);
    } else {
      discountAmount = Number(transfer.discountValue);
    }
  }
  
  // Subtotal after discount
  const subtotalAfterDiscount = basePrice + totalExtraCharges - discountAmount;
  
  // Calculate commission amount
  const commissionAmountEuros = calculateCommissionAmount(transfer);
  
  // Final total
  const totalPrice = calculateTotalPrice(transfer) - commissionAmountEuros;
  
  // Render all sections
  const clientSection = renderClientSection(transfer);
  const serviceDetailsSection = renderServiceDetailsSection(transfer);
  const collaboratorSection = renderCollaboratorSection(transfer, commissionAmountEuros);
  const expensesSection = renderExpensesSection(transfer);
  const pricingDetailsSection = renderPricingDetailsSection(
    transfer, 
    basePrice, 
    totalExtraCharges, 
    discountAmount, 
    subtotalAfterDiscount, 
    commissionAmountEuros, 
    totalPrice
  );

  // Generate the HTML content - ensure styles don't leak to main window
  printWindow.document.write(`
    <html>
      <head>
        <title>Resumen del Transfer #${transfer.id}</title>
        <style>${getTransferSummaryStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="print-header">
            <h1>Resumen del Transfer</h1>
          </div>
          
          ${clientSection}
          ${serviceDetailsSection}
          ${collaboratorSection}
          ${expensesSection}
          ${pricingDetailsSection}
          
          <button class="print-button" onclick="window.print();">Imprimir Resumen</button>
          
          <div class="footer">
            Impreso el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}
          </div>
        </div>
        <script>
          // Handle cleanup when window closes
          window.addEventListener('beforeunload', function() {
            // Nothing needed here as we're in a separate window
          });
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}
