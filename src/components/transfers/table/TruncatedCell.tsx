
import React from 'react';

interface TruncatedCellProps {
  text: string;
  maxWidth?: string;
}

export function TruncatedCell({ text, maxWidth = "100px" }: TruncatedCellProps) {
  return (
    <div className="truncate" style={{ maxWidth }} title={text}>
      {text || 'N/A'}
    </div>
  );
}
