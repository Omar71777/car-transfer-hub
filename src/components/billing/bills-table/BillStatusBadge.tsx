
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bill } from '@/types/billing';

interface BillStatusBadgeProps {
  status: Bill['status'];
}

export function BillStatusBadge({ status }: BillStatusBadgeProps) {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300">Borrador</Badge>;
    case 'sent':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">Enviada</Badge>;
    case 'paid':
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">Pagada</Badge>;
    case 'cancelled':
      return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">Cancelada</Badge>;
    default:
      return null;
  }
}
