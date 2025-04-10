
import React from 'react';
import { Car, TrendingUp, CreditCard, BarChart2 } from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/utils';

interface StatCardsProps {
  stats: {
    totalTransfers: number;
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
  };
}

export const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="stat-card from-blue-500 to-blue-600 animated-gradient bg-gradient-to-r text-white">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{capitalizeFirstLetter('transfers')}</h3>
          <Car className="h-5 w-5 opacity-80" />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{stats.totalTransfers}</p>
          <p className="text-xs opacity-80 mt-1">{capitalizeFirstLetter('servicios totales')}</p>
        </div>
      </div>
      
      <div className="stat-card from-green-500 to-green-600 animated-gradient bg-gradient-to-r text-white">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{capitalizeFirstLetter('ingresos')}</h3>
          <TrendingUp className="h-5 w-5 opacity-80" />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{stats.totalIncome}€</p>
          <p className="text-xs opacity-80 mt-1">{capitalizeFirstLetter('ingresos totales')}</p>
        </div>
      </div>
      
      <div className="stat-card from-red-500 to-red-600 animated-gradient bg-gradient-to-r text-white">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{capitalizeFirstLetter('gastos')}</h3>
          <CreditCard className="h-5 w-5 opacity-80" />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{stats.totalExpenses}€</p>
          <p className="text-xs opacity-80 mt-1">{capitalizeFirstLetter('gastos totales')}</p>
        </div>
      </div>
      
      <div className="stat-card from-purple-500 to-indigo-600 animated-gradient bg-gradient-to-r text-white">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{capitalizeFirstLetter('beneficio')}</h3>
          <BarChart2 className="h-5 w-5 opacity-80" />
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{stats.netIncome}€</p>
          <p className="text-xs opacity-80 mt-1">{capitalizeFirstLetter('ingresos netos')}</p>
        </div>
      </div>
    </div>
  );
};
