
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfitCalculator } from '@/components/profits/ProfitCalculator';
import { Transfer, Expense } from '@/types';

// Datos de ejemplo (simulando lo que vendría de Firebase)
const dummyTransfers: Transfer[] = [
  {
    id: '1',
    date: '2025-04-09',
    time: '09:30',
    origin: 'Aeropuerto de Ibiza',
    destination: 'Hotel Ushuaïa',
    price: 85,
    collaborator: 'Carlos Sánchez',
    commission: 10,
    expenses: []
  },
  {
    id: '2',
    date: '2025-04-09',
    time: '14:45',
    origin: 'Hotel Pacha',
    destination: 'Playa d\'en Bossa',
    price: 65,
    collaborator: 'María López',
    commission: 15,
    expenses: []
  },
  {
    id: '3',
    date: '2025-04-08',
    time: '11:15',
    origin: 'Puerto de Ibiza',
    destination: 'Cala Comte',
    price: 120,
    collaborator: 'Juan Pérez',
    commission: 10,
    expenses: []
  },
  {
    id: '4',
    date: '2025-04-07',
    time: '16:00',
    origin: 'Ibiza Town',
    destination: 'San Antonio',
    price: 75,
    collaborator: 'Ana Martínez',
    commission: 12,
    expenses: []
  },
  {
    id: '5',
    date: '2025-04-06',
    time: '20:30',
    origin: 'Aeropuerto de Ibiza',
    destination: 'Santa Eulalia',
    price: 95,
    collaborator: 'Carlos Sánchez',
    commission: 10,
    expenses: []
  }
];

const dummyExpenses: Expense[] = [
  {
    id: '1',
    transferId: '1',
    date: '2025-04-09',
    concept: 'Combustible',
    amount: 45.50
  },
  {
    id: '2',
    transferId: '2',
    date: '2025-04-09',
    concept: 'Peaje',
    amount: 12.30
  },
  {
    id: '3',
    transferId: '3',
    date: '2025-04-08',
    concept: 'Lavado de vehículo',
    amount: 25.00
  },
  {
    id: '4',
    transferId: '4',
    date: '2025-04-07',
    concept: 'Mantenimiento',
    amount: 120.00
  },
  {
    id: '5',
    transferId: '5',
    date: '2025-04-06',
    concept: 'Combustible',
    amount: 50.75
  }
];

const ProfitsPage = () => {
  const [transfers] = useState<Transfer[]>(dummyTransfers);
  const [expenses] = useState<Expense[]>(dummyExpenses);

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-ibiza-900">Ganancias</h1>
          <p className="text-muted-foreground">Analiza tus ingresos, gastos y beneficios</p>
        </div>
        
        <ProfitCalculator transfers={transfers} expenses={expenses} />
      </div>
    </MainLayout>
  );
};

export default ProfitsPage;
