
import React from 'react';

interface TruncatedCellProps {
  text: string;
  maxWidth?: string;
}

export function TruncatedCell({ text, maxWidth = "100px" }: TruncatedCellProps) {
  return (
    <div className="truncate-cell" title={text}>
      {text || 'N/A'}
    </div>
  );
}
