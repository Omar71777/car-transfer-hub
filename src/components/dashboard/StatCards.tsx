
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
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
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
        <div className="h-2 w-full bg-gradient-to-r from-aqua/20 via-aqua/80 to-aqua/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-green-600 to-green-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
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
        <div className="h-2 w-full bg-gradient-to-r from-green-300/20 via-green-300/80 to-green-300/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-red-600 to-red-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
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
        <div className="h-2 w-full bg-gradient-to-r from-red-300/20 via-red-300/80 to-red-300/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-purple-600 to-purple-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
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
        <div className="h-2 w-full bg-gradient-to-r from-purple-300/20 via-purple-300/80 to-purple-300/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
    </div>
  );
};
