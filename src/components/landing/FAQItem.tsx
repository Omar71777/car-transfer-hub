
import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <div className="p-6 border rounded-xl hover:border-primary/50 transition-all hover:shadow-sm">
      <h3 className="text-lg font-bold mb-2">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
};
