
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bill } from '@/types/billing';

interface BillStatusBadgeProps {
  status: Bill['status'];
}

export function BillStatusBadge({ status }: BillStatusBadgeProps) {
  switch (status) {
    case 'draft':
      return <Badge variant="outline">Borrador</Badge>;
    case 'sent':
      return <Badge variant="secondary">Enviada</Badge>;
    case 'paid':
      return <Badge variant="default" className="bg-green-600">Pagada</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelada</Badge>;
    default:
      return null;
  }
}
