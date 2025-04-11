
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
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-white/80">Ingresos Totales</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalIncome)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-gradient-to-r from-blue-300/20 via-blue-300/80 to-blue-300/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-red-600 to-red-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-white/80">Gastos Totales</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalExpenses)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-gradient-to-r from-red-300/20 via-red-300/80 to-red-300/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-amber-600 to-amber-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-white/80">Comisiones</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalCommissions)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-gradient-to-r from-amber-300/20 via-amber-300/80 to-amber-300/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-br from-green-600 to-green-500 text-white">
        {/* Always visible shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-white/80">Beneficio Neto</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.netProfit)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
        <div className="h-2 w-full bg-gradient-to-r from-green-300/20 via-green-300/80 to-green-300/20 absolute bottom-0 transition-all ease-in-out"></div>
      </Card>
    </div>
  );
};
