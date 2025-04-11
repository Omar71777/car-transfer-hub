
/**
 * Generates HTML for the status badge
 */
export const getStatusBadge = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'draft': 'Borrador',
    'sent': 'Enviada',
    'paid': 'Pagada',
    'cancelled': 'Cancelada'
  };
  
  return `<span class="status-badge status-${status}">${statusLabels[status] || status}</span>`;
};
