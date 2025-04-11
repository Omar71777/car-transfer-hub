
import React from 'react';

interface TruncatedCellProps {
  text: string;
  maxWidth?: string;
}

export function TruncatedCell({ text, maxWidth = "150px" }: TruncatedCellProps) {
  return (
    <div className="truncate" style={{ maxWidth }} title={text}>
      {text || 'N/A'}
    </div>
  );
}
