
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ServiceTypeBadgeProps {
  serviceType: string;
}

export function ServiceTypeBadge({ serviceType }: ServiceTypeBadgeProps) {
  return (
    <Badge 
      variant={serviceType === 'dispo' ? 'outline' : 'secondary'} 
      className="font-normal text-xs px-2 py-1"
    >
      {serviceType === 'dispo' ? 'Dispo' : 'Transfer'}
    </Badge>
  );
}
