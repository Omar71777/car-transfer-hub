
/**
 * Generates the CSS styles for the bill document
 */
export const generateStyles = (): string => {
  return `
    <style>
      :root {
        --primary-color: #0ea5e9;
        --border-color: #e2e8f0;
        --bg-color: #ffffff;
        --text-color: #1e293b;
        --muted-color: #64748b;
        --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      
      @media (prefers-color-scheme: dark) {
        :root {
          --primary-color: #38bdf8;
          --border-color: #334155;
          --bg-color: #0f172a;
          --text-color: #f8fafc;
          --muted-color: #94a3b8;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 0;
        padding: 20px;
        color: var(--text-color);
        background-color: var(--bg-color);
      }
      
      .print-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: var(--card-shadow);
        background-color: var(--bg-color);
      }
      
      .document-header {
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--primary-color);
        margin-bottom: 30px;
      }
      
      .header-left, .header-right {
        display: flex;
        flex-direction: column;
      }
      
      .header-title {
        color: var(--primary-color);
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 5px;
        margin-top: 0;
      }
      
      .header-subtitle {
        font-size: 1rem;
        color: var(--muted-color);
        margin-top: 0;
      }
      
      .company-details, .client-details {
        margin-bottom: 20px;
      }
      
      .company-logo {
        max-width: 150px;
        max-height: 80px;
        margin-bottom: 10px;
      }
      
      .company-name, .client-name {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 5px;
        margin-top: 0;
      }
      
      .details-row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      
      .detail-card {
        background-color: rgba(var(--primary-color-rgb), 0.05);
        border-radius: 8px;
        padding: 15px;
        flex: 1;
        min-width: 200px;
        margin-right: 15px;
        margin-bottom: 15px;
      }
      
      .detail-card h3 {
        margin-top: 0;
        font-size: 1rem;
        color: var(--primary-color);
        margin-bottom: 10px;
      }
      
      .detail-card p {
        margin: 0;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .items-table th {
        border-bottom: 2px solid var(--border-color);
        padding: 12px 8px;
        text-align: left;
        color: var(--primary-color);
      }
      
      .items-table td {
        border-bottom: 1px solid var(--border-color);
        padding: 12px 8px;
      }
      
      .items-table tr:last-child td {
        border-bottom: none;
      }
      
      .text-right {
        text-align: right;
      }
      
      .extra-charge-row {
        background-color: rgba(var(--primary-color-rgb), 0.03);
      }
      
      .totals-section {
        margin-top: 20px;
        border-top: 1px solid var(--border-color);
        padding-top: 20px;
      }
      
      .totals-table {
        width: 100%;
        max-width: 400px;
        margin-left: auto;
      }
      
      .totals-table td {
        padding: 8px 0;
      }
      
      .totals-table .total-row {
        font-weight: bold;
        color: var(--primary-color);
        font-size: 1.1rem;
      }
      
      .notes-section {
        margin-top: 30px;
        padding: 15px;
        background-color: rgba(var(--primary-color-rgb), 0.05);
        border-radius: 8px;
      }
      
      .notes-title {
        font-weight: 600;
        margin-top: 0;
        margin-bottom: 10px;
        color: var(--primary-color);
      }
      
      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 30px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
      }
      
      .status-draft {
        background-color: #f1f5f9;
        color: #475569;
      }
      
      .status-sent {
        background-color: #eff6ff;
        color: #3b82f6;
      }
      
      .status-paid {
        background-color: #ecfdf5;
        color: #10b981;
      }
      
      .status-cancelled {
        background-color: #fef2f2;
        color: #ef4444;
      }
      
      .print-actions {
        text-align: center;
        margin-top: 30px;
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition: opacity 0.2s;
        text-decoration: none;
      }
      
      .btn:hover {
        opacity: 0.9;
      }
      
      .btn-secondary {
        background-color: var(--muted-color);
      }
      
      /* Print styles */
      @media print {
        body { 
          background-color: white;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-container {
          box-shadow: none;
          max-width: 100%;
          padding: 0;
        }
        .print-actions {
          display: none !important;
        }
      }
    </style>
  `;
};
