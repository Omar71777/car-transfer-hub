
import { Transfer } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { calculateCommissionAmount, calculateTotalPrice } from '@/lib/calculations';

export function printTransferSummary(transfer: Transfer) {
  if (!transfer) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir el resumen');
    return;
  }

  // Function to format date (assumes date is in YYYY-MM-DD format)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Base price calculation
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
  
  // Calculate total expenses
  const totalExpenses = transfer.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Generate the HTML content
  printWindow.document.write(`
    <html>
      <head>
        <title>Resumen del Transfer #${transfer.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; margin-bottom: 20px; }
          h2 { color: #555; margin-top: 30px; margin-bottom: 10px; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .section { margin-bottom: 25px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .grid div { padding: 5px 0; }
          .label { color: #666; font-size: 14px; }
          .value { font-weight: 500; }
          .expenses-grid { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 10px; margin-top: 10px; }
          .expenses-header { font-weight: bold; background-color: #f5f5f5; padding: 8px 5px; }
          .expenses-row { padding: 5px; border-bottom: 1px solid #eee; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px; }
          .print-button { display: block; margin: 40px auto; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
          @media print {
            .print-button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Resumen del Transfer</h1>
        
        ${transfer.client ? `
        <div class="section">
          <h2>Información del Cliente</h2>
          <div class="grid">
            <div>
              <div class="label">Cliente</div>
              <div class="value">${transfer.client.name}</div>
            </div>
            <div>
              <div class="label">Email</div>
              <div class="value">${transfer.client.email || 'No especificado'}</div>
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <h2>Detalles del Servicio</h2>
          <div class="grid">
            <div>
              <div class="label">Tipo de servicio</div>
              <div class="value">${transfer.serviceType === 'transfer' ? 'Transfer' : 'Disposición'}</div>
            </div>
            <div>
              <div class="label">Fecha y hora</div>
              <div class="value">${formatDate(transfer.date)} ${transfer.time || ''}</div>
            </div>
            
            ${transfer.serviceType === 'transfer' ? `
            <div>
              <div class="label">Origen</div>
              <div class="value">${transfer.origin}</div>
            </div>
            <div>
              <div class="label">Destino</div>
              <div class="value">${transfer.destination || ''}</div>
            </div>
            ` : `
            <div>
              <div class="label">Punto de inicio</div>
              <div class="value">${transfer.origin}</div>
            </div>
            <div>
              <div class="label">Horas contratadas</div>
              <div class="value">${transfer.hours} ${Number(transfer.hours) === 1 ? 'hora' : 'horas'}</div>
            </div>
            `}
            
            <div>
              <div class="label">Estado de pago</div>
              <div class="value">${transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente de pago'}</div>
            </div>
          </div>
        </div>
        
        ${transfer.collaborator ? `
        <div class="section">
          <h2>Información del Colaborador</h2>
          <div class="grid">
            <div>
              <div class="label">Colaborador</div>
              <div class="value">${transfer.collaborator}</div>
            </div>
            <div>
              <div class="label">Comisión</div>
              <div class="value">
                ${transfer.commission}${transfer.commissionType === 'percentage' ? '%' : '€'} 
                (${formatCurrency(commissionAmountEuros)})
              </div>
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <h2>Detalles de Precios</h2>
          <div class="grid">
            <div>
              <div class="label">Precio base</div>
              <div class="value">${formatCurrency(basePrice)}</div>
            </div>
            
            ${transfer.discountType && transfer.discountValue ? `
            <div>
              <div class="label">Descuento (${transfer.discountType === 'percentage' ? transfer.discountValue + '%' : formatCurrency(Number(transfer.discountValue))})</div>
              <div class="value">-${formatCurrency(discountAmount)}</div>
            </div>
            ` : ''}
            
            ${validExtraCharges.length > 0 ? `
            <div>
              <div class="label">Cargos adicionales</div>
              <div class="value">+${formatCurrency(totalExtraCharges)}</div>
            </div>
            ` : ''}
            
            <div>
              <div class="label">Subtotal</div>
              <div class="value">${formatCurrency(subtotalAfterDiscount)}</div>
            </div>
            
            ${commissionAmountEuros > 0 ? `
            <div>
              <div class="label">Comisión del colaborador</div>
              <div class="value">-${formatCurrency(commissionAmountEuros)}</div>
            </div>
            ` : ''}
            
            <div>
              <div class="label">Precio final</div>
              <div class="value">${formatCurrency(totalPrice)}</div>
            </div>
          </div>
        </div>
        
        ${transfer.expenses && transfer.expenses.length > 0 ? `
        <div class="section">
          <h2>Gastos Asociados</h2>
          <div class="expenses-grid">
            <div class="expenses-header">Fecha</div>
            <div class="expenses-header">Concepto</div>
            <div class="expenses-header text-right">Importe</div>
            
            ${transfer.expenses.map(expense => `
            <div class="expenses-row">${formatDate(expense.date)}</div>
            <div class="expenses-row">${expense.concept}</div>
            <div class="expenses-row text-right">${formatCurrency(expense.amount)}</div>
            `).join('')}
            
            <div class="expenses-row total-row"></div>
            <div class="expenses-row total-row">Total gastos:</div>
            <div class="expenses-row total-row text-right">${formatCurrency(totalExpenses)}</div>
          </div>
        </div>
        ` : ''}
        
        <button class="print-button" onclick="window.print();">Imprimir Resumen</button>
        
        <div class="footer">
          Impreso el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}
