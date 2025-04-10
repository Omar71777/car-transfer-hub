
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfitCalculator } from '@/components/profits/ProfitCalculator';
import { Transfer, Expense } from '@/types';

// Datos de ejemplo para fallback
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
  }
];

const ProfitsPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Cargar transfers desde localStorage
    const storedTransfers = localStorage.getItem('transfers');
    if (storedTransfers) {
      setTransfers(JSON.parse(storedTransfers));
    } else {
      setTransfers(dummyTransfers);
    }

    // Cargar expenses desde localStorage
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      setExpenses(dummyExpenses);
    }
  }, []);

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
