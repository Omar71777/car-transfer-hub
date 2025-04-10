import React from 'react';
import { capitalizeFirstLetter, capitalizeWords } from '@/lib/utils';

interface CapitalizedTextProps {
  children: React.ReactNode;
  capitalizeAllWords?: boolean;
  className?: string;
}

export function CapitalizedText({ 
  children, 
  capitalizeAllWords = false,
  className = '' 
}: CapitalizedTextProps) {
  // If children is a string, capitalize it
  if (typeof children === 'string') {
    return (
      <span className={className}>
        {capitalizeAllWords ? capitalizeWords(children) : capitalizeFirstLetter(children)}
      </span>
    );
  }

  // If it's not a string, we need to clone and modify React elements
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      className: `${children.props.className || ''} ${className}`.trim(),
      children: typeof children.props.children === 'string' 
        ? (capitalizeAllWords 
            ? capitalizeWords(children.props.children) 
            : capitalizeFirstLetter(children.props.children))
        : children.props.children
    });
  }

  // For any other type, return unchanged
  return <>{children}</>;
}
