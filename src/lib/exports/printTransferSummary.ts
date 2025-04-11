
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
  const totalExpenses = transfer.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Generate the HTML content
  printWindow.document.write(`
    <html>
      <head>
        <title>Resumen del Transfer #${transfer.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background-color: #f5f8fc;
            color: #333;
            line-height: 1.5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
          }
          h1 {
            color: #0088e6;
            margin-bottom: 15px;
            font-size: 28px;
          }
          .card {
            background-color: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
            border: 1px solid rgba(0, 0, 0, 0.05);
          }
          .card h2 {
            color: #333;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .label {
            color: #666;
            font-size: 13px;
            margin-bottom: 2px;
          }
          .value {
            font-weight: 500;
            font-size: 15px;
          }
          .flex-between {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          .separator {
            height: 1px;
            background-color: #eee;
            margin: 12px 0;
          }
          .expenses-header, .expense-row {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 10px;
            padding: 8px 5px;
          }
          .expenses-header {
            font-weight: bold;
            background-color: #f5f5f5;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          .expense-row {
            border-bottom: 1px solid #f0f0f0;
          }
          .text-right {
            text-align: right;
          }
          .text-primary {
            color: #0088e6;
          }
          .text-green {
            color: #22c55e;
          }
          .text-amber {
            color: #f59e0b;
          }
          .total-row {
            font-weight: bold;
            margin-top: 10px;
          }
          .print-button {
            display: block;
            margin: 40px auto;
            padding: 10px 20px;
            background: #0088e6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 16px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            .card {
              box-shadow: none;
              break-inside: avoid;
            }
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="print-header">
            <h1>Resumen del Transfer</h1>
          </div>
          
          ${transfer.client ? `
          <div class="card">
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
          
          <div class="card">
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
          <div class="card">
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
                  <span style="color: #666; font-size: 13px;">
                    (${formatCurrency(commissionAmountEuros)})
                  </span>
                </div>
              </div>
            </div>
          </div>
          ` : ''}
          
          <div class="card">
            <h2>Detalles de Precios</h2>
            <div>
              ${transfer.serviceType === 'dispo' ? `
              <div class="flex-between">
                <div>Precio base (${transfer.price}€ × ${transfer.hours} horas)</div>
                <div>${formatCurrency(basePrice)}</div>
              </div>
              ` : `
              <div class="flex-between">
                <div>Precio base</div>
                <div>${formatCurrency(basePrice)}</div>
              </div>
              `}
              
              ${transfer.discountType && transfer.discountValue ? `
              <div class="flex-between" style="color: #22c55e;">
                <div>Descuento ${transfer.discountType === 'percentage' ? `(${transfer.discountValue}%)` : ''}</div>
                <div>-${formatCurrency(discountAmount)}</div>
              </div>
              ` : ''}
              
              <div class="separator"></div>
              
              ${validExtraCharges.length > 0 ? 
                validExtraCharges.map(charge => `
                <div class="flex-between">
                  <div>${charge.name}</div>
                  <div>${formatCurrency(Number(charge.price) || 0)}</div>
                </div>
                `).join('') + `
                <div class="flex-between" style="font-weight: 500;">
                  <div>Subtotal cargos extra</div>
                  <div>${formatCurrency(totalExtraCharges)}</div>
                </div>
                ` : ''}
              
              <div class="separator"></div>
              
              <div class="flex-between" style="font-weight: 600;">
                <div>Subtotal</div>
                <div>${formatCurrency(subtotalAfterDiscount)}</div>
              </div>
              
              ${commissionAmountEuros > 0 ? `
              <div class="flex-between" style="color: #f59e0b;">
                <div>Comisión colaborador ${transfer.commissionType === 'percentage' ? `(${transfer.commission}%)` : ''}</div>
                <div>-${formatCurrency(commissionAmountEuros)}</div>
              </div>
              ` : ''}
              
              <div class="separator"></div>
              
              <div class="flex-between" style="font-weight: 700;">
                <div>TOTAL</div>
                <div>${formatCurrency(totalPrice)}</div>
              </div>
            </div>
          </div>
          
          ${transfer.expenses && transfer.expenses.length > 0 ? `
          <div class="card">
            <h2>Gastos Asociados</h2>
            <div>
              <div class="expenses-header">
                <div>Fecha</div>
                <div>Concepto</div>
                <div class="text-right">Importe</div>
              </div>
              
              <div style="max-height: 220px; overflow-y: auto;">
                ${transfer.expenses.map(expense => `
                <div class="expense-row">
                  <div>${formatDate(expense.date)}</div>
                  <div>${expense.concept}</div>
                  <div class="text-right">${formatCurrency(expense.amount)}</div>
                </div>
                `).join('')}
              </div>
              
              <div class="separator"></div>
              
              <div class="flex-between total-row">
                <div>Total gastos:</div>
                <div class="text-primary">${formatCurrency(totalExpenses)}</div>
              </div>
            </div>
          </div>
          ` : ''}
          
          <button class="print-button" onclick="window.print();">Imprimir Resumen</button>
          
          <div class="footer">
            Impreso el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}
          </div>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}
