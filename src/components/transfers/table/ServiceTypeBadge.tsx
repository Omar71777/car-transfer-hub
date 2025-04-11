
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ServiceTypeBadgeProps {
  serviceType: string;
}

export function ServiceTypeBadge({ serviceType }: ServiceTypeBadgeProps) {
  if (serviceType === 'dispo') {
    return (
      <Badge 
        variant="outline" 
        className="font-normal text-xs px-2 py-1"
      >
        Dispo
      </Badge>
    );
  }
  
  // Simple text for transfer without background
  return (
    <span className="text-xs font-medium">
      Transf
    </span>
  );
}
