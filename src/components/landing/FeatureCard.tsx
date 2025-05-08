
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
}

export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  highlighted = false 
}: FeatureCardProps) => {
  return (
    <Card className={`transition-all hover:shadow-md ${highlighted ? 'border-primary/50 shadow-lg' : ''} hover:-translate-y-1 duration-300`}>
      <CardContent className="pt-6">
        <div className={`mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${highlighted ? 'bg-primary/10' : 'bg-muted'}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
