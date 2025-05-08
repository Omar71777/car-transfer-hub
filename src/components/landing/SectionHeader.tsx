
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground text-lg">{subtitle}</p>
    </div>
  );
};
