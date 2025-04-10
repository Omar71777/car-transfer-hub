
import React from 'react';
import { capitalizeFirstLetter, capitalizeWords } from '@/lib/utils';

// HOC to automatically capitalize text in child components
export function withCapitalization<P extends object>(
  Component: React.ComponentType<P>,
  options: { capitalizeAllWords?: boolean } = {}
): React.FC<P> {
  return (props: P) => {
    // Create a function to capitalize text nodes recursively
    const capitalizeTextNodes = (children: React.ReactNode): React.ReactNode => {
      if (typeof children === 'string') {
        return options.capitalizeAllWords 
          ? capitalizeWords(children) 
          : capitalizeFirstLetter(children);
      }

      if (React.isValidElement(children)) {
        return React.cloneElement(
          children,
          { ...children.props },
          capitalizeTextNodes(children.props.children)
        );
      }

      if (Array.isArray(children)) {
        return React.Children.map(children, child => capitalizeTextNodes(child));
      }

      return children;
    };

    // Apply to all props that might contain text
    const processedProps = { ...props } as any;
    
    // Process common props that might contain text
    if (processedProps.title && typeof processedProps.title === 'string') {
      processedProps.title = options.capitalizeAllWords 
        ? capitalizeWords(processedProps.title) 
        : capitalizeFirstLetter(processedProps.title);
    }
    
    if (processedProps.placeholder && typeof processedProps.placeholder === 'string') {
      processedProps.placeholder = options.capitalizeAllWords 
        ? capitalizeWords(processedProps.placeholder) 
        : capitalizeFirstLetter(processedProps.placeholder);
    }
    
    if (processedProps.label && typeof processedProps.label === 'string') {
      processedProps.label = options.capitalizeAllWords 
        ? capitalizeWords(processedProps.label) 
        : capitalizeFirstLetter(processedProps.label);
    }

    return <Component {...processedProps as P}>{capitalizeTextNodes(props.children)}</Component>;
  };
}
