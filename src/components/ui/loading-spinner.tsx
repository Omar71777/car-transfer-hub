
import React from 'react';

export function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center w-full py-10 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
