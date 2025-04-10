
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface RowCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export function RowCheckbox({ checked, onChange, id }: RowCheckboxProps) {
  return (
    <Checkbox
      id={`row-${id}`}
      checked={checked}
      onCheckedChange={onChange}
      aria-label="Select row"
    />
  );
}
