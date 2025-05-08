
import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
}

export const StatCard = ({ number, label }: StatCardProps) => {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
};
