
import React from 'react';
import { Car, TrendingUp, CreditCard, BarChart2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

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
      <Card className="border-none shadow-md bg-gradient-to-br from-blue-500/90 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white/90">Transfers</h3>
            <div className="p-2 bg-white/20 rounded-full">
              <Car className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">{stats.totalTransfers}</p>
            <div className="flex items-center text-xs text-white/80">
              <span>Servicios totales</span>
              {stats.totalTransfers > 0 && (
                <ArrowRight className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md bg-gradient-to-br from-green-500/90 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white/90">Ingresos</h3>
            <div className="p-2 bg-white/20 rounded-full">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(stats.totalIncome)}</p>
            <div className="flex items-center text-xs text-white/80">
              <span>Ingresos totales</span>
              {stats.totalIncome > 0 && (
                <ArrowRight className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md bg-gradient-to-br from-red-500/90 to-red-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white/90">Gastos</h3>
            <div className="p-2 bg-white/20 rounded-full">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(stats.totalExpenses)}</p>
            <div className="flex items-center text-xs text-white/80">
              <span>Gastos y comisiones</span>
              {stats.totalExpenses > 0 && (
                <ArrowRight className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md bg-gradient-to-br from-purple-500/90 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white/90">Beneficio</h3>
            <div className="p-2 bg-white/20 rounded-full">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(stats.netIncome)}</p>
            <div className="flex items-center text-xs text-white/80">
              <span>Beneficio neto</span>
              {stats.netIncome > 0 && (
                <ArrowRight className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
