
import React from 'react';
import { render } from '@testing-library/react';
import { Transfer } from '@/types';

export const mockTransfer: Transfer = {
  id: '1',
  date: '2024-04-28',
  time: '10:00',
  serviceType: 'transfer',
  origin: 'Airport',
  destination: 'Hotel',
  price: 100,
  paymentStatus: 'pending',
  clientId: '1',
  billed: false,
  extraCharges: [
    { name: 'Extra Luggage', price: 20 }
  ]
};

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};
