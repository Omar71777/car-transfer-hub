
/**
 * Utility functions for transfer summary printing
 */

/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Generates CSS styles for the printed transfer summary
 */
export function getTransferSummaryStyles(): string {
  return `
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
  `;
}
