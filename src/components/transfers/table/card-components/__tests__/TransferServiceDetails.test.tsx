
import { render, screen } from '@testing-library/react';
import { TransferServiceDetails } from '../TransferServiceDetails';
import { mockTransfer } from './test-utils';

describe('TransferServiceDetails', () => {
  it('renders transfer service details', () => {
    render(<TransferServiceDetails transfer={mockTransfer} />);
    
    expect(screen.getByText('Airport')).toBeInTheDocument();
    expect(screen.getByText('Hotel')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('renders dispo service details', () => {
    const dispoTransfer = {
      ...mockTransfer,
      serviceType: 'dispo' as const,
      hours: 4
    };

    render(<TransferServiceDetails transfer={dispoTransfer} />);
    expect(screen.getByText('4h')).toBeInTheDocument();
  });
});
