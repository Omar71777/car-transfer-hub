
import React from 'react';
import { render } from '@testing-library/react';
import { Transfer, ExtraCharge } from '@/types';

export const mockTransfer: Transfer = {
  id: '1',
  date: '2023-05-01',
  time: '10:00',
  serviceType: 'transfer',
  origin: 'Airport',
  destination: 'Hotel',
  price: 100,
  paymentStatus: 'pending',
  clientId: '1',
  billed: false,
  collaborator: 'none',
  commission: 0,
  commissionType: 'percentage',
  expenses: [],
  extraCharges: [
    {
      id: 'ec1',
      name: 'Extra Luggage',
      price: 20,
      transferId: '1'
    }
  ]
};

// Helper for rendering components
export const renderWithProvider = (ui: React.ReactElement) => {
  return render(ui);
};
