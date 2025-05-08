
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  company: string;
  rating: number;
}

export const TestimonialCard = ({ 
  quote, 
  author, 
  company, 
  rating 
}: TestimonialCardProps) => {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-5 w-5 ${i < rating ? 'text-primary fill-primary' : 'text-muted'}`}
            />
          ))}
        </div>
        <p className="mb-6 text-lg">{quote}</p>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardContent>
    </Card>
  );
};
