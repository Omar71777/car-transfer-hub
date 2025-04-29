
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bill } from '@/types/billing';

interface BillStatusBadgeProps {
  status: Bill['status'];
  size?: 'default' | 'sm' | 'lg';
}

export function BillStatusBadge({ status, size = 'default' }: BillStatusBadgeProps) {
  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return 'text-[10px] px-1.5 py-0';
      case 'lg': return 'text-sm px-3 py-1';
      default: return 'text-xs px-2.5 py-0.5';
    }
  };
  
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          label: 'Borrador',
          variant: 'secondary' as const,
          icon: '📝',
          className: 'bg-muted text-muted-foreground'
        };
      case 'sent':
        return {
          label: 'Enviada',
          variant: 'default' as const,
          icon: '📤',
          className: 'bg-blue-100 text-blue-800'
        };
      case 'paid':
        return {
          label: 'Pagada',
          variant: 'success' as const,
          icon: '✅',
          className: 'bg-green-100 text-green-800'
        };
      case 'cancelled':
        return {
          label: 'Cancelada',
          variant: 'destructive' as const,
          icon: '❌',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: 'Desconocido',
          variant: 'outline' as const,
          icon: '❓',
          className: ''
        };
    }
  };
  
  const config = getStatusConfig();
  const sizeClasses = getSizeClasses();
  
  return (
    <Badge 
      variant={config.variant}
      className={`${sizeClasses} font-medium ${config.className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
