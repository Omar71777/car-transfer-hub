
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface RowCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  indeterminate?: boolean;
}

export function RowCheckbox({ checked, onChange, id, indeterminate }: RowCheckboxProps) {
  return (
    <Checkbox
      id={`row-${id}`}
      checked={checked}
      onCheckedChange={onChange}
      aria-label="Select row"
      data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
      className={indeterminate ? "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground" : ""}
    />
  );
}
