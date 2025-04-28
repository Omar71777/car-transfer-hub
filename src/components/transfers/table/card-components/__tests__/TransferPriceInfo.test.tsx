
import { render, screen } from '@testing-library/react';
import { TransferPriceInfo } from '../TransferPriceInfo';
import { mockTransfer } from './test-utils';

describe('TransferPriceInfo', () => {
  it('renders price information', () => {
    render(<TransferPriceInfo transfer={mockTransfer} />);
    
    expect(screen.getByText('Precio Total:')).toBeInTheDocument();
    expect(screen.getByText('100,00 €')).toBeInTheDocument();
  });

  it('renders discount when present', () => {
    const transferWithDiscount = {
      ...mockTransfer,
      discountType: 'percentage' as const,
      discountValue: 10
    };

    render(<TransferPriceInfo transfer={transferWithDiscount} />);
    expect(screen.getByText('10%')).toBeInTheDocument();
  });
});
