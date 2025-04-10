import React, { createContext, useContext, useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '@/lib/utils';

interface CapitalizeContextType {
  capitalize: (text: string | undefined | null) => string;
  capitalizeAll: (obj: any) => any;
}

const CapitalizeContext = createContext<CapitalizeContextType>({
  capitalize: (text) => text || '',
  capitalizeAll: (obj) => obj,
});

export const useCapitalize = () => useContext(CapitalizeContext);

export const CapitalizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Function to capitalize a string
  const capitalize = (text: string | undefined | null): string => {
    return capitalizeFirstLetter(text);
  };
  
  // Function to recursively capitalize all string values in an object or array
  const capitalizeAll = (obj: any): any => {
    if (!obj) return obj;
    
    // Handle strings directly
    if (typeof obj === 'string') {
      return capitalize(obj);
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => capitalizeAll(item));
    }
    
    // Handle objects
    if (typeof obj === 'object' && obj !== null) {
      const result: Record<string, any> = {};
      
      for (const key in obj) {
        result[key] = capitalizeAll(obj[key]);
      }
      
      return result;
    }
    
    // Return unchanged for other types
    return obj;
  };

  return (
    <CapitalizeContext.Provider value={{ capitalize, capitalizeAll }}>
      {children}
    </CapitalizeContext.Provider>
  );
};

// Custom hook for using capitalization in components
export const useCapitalizeText = () => {
  const { capitalize } = useCapitalize();
  return capitalize;
};
