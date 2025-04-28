
import { render, screen } from '@testing-library/react';
import { TransferCollaboratorInfo } from '../TransferCollaboratorInfo';
import { mockTransfer } from './test-utils';

describe('TransferCollaboratorInfo', () => {
  it('renders collaborator info when present', () => {
    const transferWithCollaborator = {
      ...mockTransfer,
      collaborator: 'John Doe',
      commission: 10,
      commissionType: 'percentage' as const
    };

    render(<TransferCollaboratorInfo transfer={transferWithCollaborator} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('(10%)')).toBeInTheDocument();
  });

  it('returns null when no collaborator', () => {
    const { container } = render(<TransferCollaboratorInfo transfer={mockTransfer} />);
    expect(container.firstChild).toBeNull();
  });
});
