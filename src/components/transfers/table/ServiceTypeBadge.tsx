
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ServiceTypeBadgeProps {
  serviceType: string;
  hours?: number | string;
}

export function ServiceTypeBadge({ serviceType, hours }: ServiceTypeBadgeProps) {
  const serviceTypeDisplay = () => {
    if (serviceType === 'dispo') {
      return `Dispo ${hours || 0}h`;
    }
    return 'Transfer';
  };

  return (
    <Badge variant="outline" className="font-normal whitespace-nowrap text-xs">
      {serviceTypeDisplay()}
    </Badge>
  );
}
