
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransferExtraCharges } from '../TransferExtraCharges';
import { mockTransfer } from './test-utils';

describe('TransferExtraCharges', () => {
  it('renders extra charges when present', () => {
    render(<TransferExtraCharges extraCharges={mockTransfer.extraCharges} />);
    
    expect(screen.getByText('Extra Luggage')).toBeInTheDocument();
    expect(screen.getByText('20,00 €')).toBeInTheDocument();
  });

  it('returns null when no extra charges', () => {
    const { container } = render(<TransferExtraCharges extraCharges={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
