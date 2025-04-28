
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for the matchers
import { TransferCardView } from '../TransferCardView';
import { mockTransfer } from '../card-components/__tests__/test-utils';

describe('TransferCardView', () => {
  const mockProps = {
    transfers: [mockTransfer],
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onAddExpense: vi.fn(),
    onViewSummary: vi.fn(),
    onSelectRow: vi.fn(),
    onMarkAsPaid: vi.fn(),
    selectedRows: [],
  };

  it('renders transfer cards', () => {
    render(<TransferCardView {...mockProps} />);
    
    expect(screen.getByText('Airport')).toBeInTheDocument();
    expect(screen.getByText('Hotel')).toBeInTheDocument();
    expect(screen.getByText('100,00 €')).toBeInTheDocument();
  });

  it('handles empty transfers array', () => {
    render(<TransferCardView {...mockProps} transfers={[]} />);
    expect(screen.getByText('No hay transfers para mostrar')).toBeInTheDocument();
  });

  it('calls action handlers when buttons are clicked', () => {
    render(<TransferCardView {...mockProps} />);
    
    // Find and click edit button
    const editButton = screen.getByLabelText('Edit transfer');
    fireEvent.click(editButton);
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTransfer);
  });
});
