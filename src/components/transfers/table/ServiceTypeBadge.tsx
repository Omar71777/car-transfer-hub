
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ServiceTypeBadgeProps {
  serviceType: string;
}

export function ServiceTypeBadge({ serviceType }: ServiceTypeBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className="font-normal whitespace-nowrap text-xs"
    >
      {serviceType === 'dispo' ? 'Dispo' : 'Transfer'}
    </Badge>
  );
}
