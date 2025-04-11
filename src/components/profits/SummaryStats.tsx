
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SummaryStatsProps {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    totalCommissions: number;
    netProfit: number;
    profitMargin: number;
  };
}

export const SummaryStats = ({ stats }: SummaryStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden rounded-xl border-l-4 border-l-blue-500 group bg-gradient-to-r from-blue-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-blue-500 mt-1">{formatCurrency(stats.totalIncome)}</h3>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-500/40" />
          </div>
        </CardContent>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500/20 via-blue-500/80 to-blue-500/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-l-4 border-l-red-500 group bg-gradient-to-r from-red-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-red-100/0 via-red-100/30 to-red-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>
              <h3 className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(stats.totalExpenses)}</h3>
            </div>
            <TrendingDown className="h-10 w-10 text-red-500/40" />
          </div>
        </CardContent>
        <div className="h-1 w-full bg-gradient-to-r from-red-500/20 via-red-500/80 to-red-500/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-l-4 border-l-amber-500 group bg-gradient-to-r from-amber-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/0 via-amber-100/30 to-amber-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Comisiones</p>
              <h3 className="text-2xl font-bold text-amber-500 mt-1">{formatCurrency(stats.totalCommissions)}</h3>
            </div>
            <CreditCard className="h-10 w-10 text-amber-500/40" />
          </div>
        </CardContent>
        <div className="h-1 w-full bg-gradient-to-r from-amber-500/20 via-amber-500/80 to-amber-500/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-l-4 border-l-green-500 group bg-gradient-to-r from-green-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/0 via-green-100/30 to-green-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Beneficio Neto</p>
              <h3 className="text-2xl font-bold text-green-500 mt-1">{formatCurrency(stats.netProfit)}</h3>
            </div>
            <DollarSign className="h-10 w-10 text-green-500/40" />
          </div>
        </CardContent>
        <div className="h-1 w-full bg-gradient-to-r from-green-500/20 via-green-500/80 to-green-500/20 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
    </div>
  );
};
