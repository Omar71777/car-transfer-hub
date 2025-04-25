import { Transfer } from '@/types';
import { calculateCommissionAmount, calculateTotalPrice, calculateBasePrice, calculateDiscountAmount, calculateExtraChargesTotal } from '@/lib/calculations';

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

  // Calculate financial data using the unified calculation functions
  const basePrice = calculateBasePrice(transfer);
  const totalExtraCharges = calculateExtraChargesTotal(transfer.extraCharges);
  const discountAmount = calculateDiscountAmount(transfer);
  const subtotalAfterDiscount = basePrice - discountAmount + totalExtraCharges;
  const commissionAmountEuros = calculateCommissionAmount(transfer);
  const totalPrice = calculateTotalPrice(transfer);

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
