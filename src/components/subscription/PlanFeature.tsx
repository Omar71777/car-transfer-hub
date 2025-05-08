
import React from 'react';
import { Check } from 'lucide-react';

interface PlanFeatureProps {
  children: React.ReactNode;
}

export const PlanFeature: React.FC<PlanFeatureProps> = ({ children }) => {
  return (
    <li className="flex items-center">
      <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
};
