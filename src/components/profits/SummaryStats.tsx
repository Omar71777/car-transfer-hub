
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

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
      <Card className="glass-card shine-effect border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-blue-500 mt-1">{stats.totalIncome.toFixed(2)}€</h3>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-500/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card shine-effect border-l-4 border-l-red-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>
              <h3 className="text-2xl font-bold text-red-500 mt-1">{(stats.totalExpenses - stats.totalCommissions).toFixed(2)}€</h3>
            </div>
            <TrendingDown className="h-10 w-10 text-red-500/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card shine-effect border-l-4 border-l-amber-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Comisiones</p>
              <h3 className="text-2xl font-bold text-amber-500 mt-1">{stats.totalCommissions.toFixed(2)}€</h3>
            </div>
            <CreditCard className="h-10 w-10 text-amber-500/40" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card shine-effect border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Beneficio Neto</p>
              <h3 className="text-2xl font-bold text-green-500 mt-1">{stats.netProfit.toFixed(2)}€</h3>
            </div>
            <DollarSign className="h-10 w-10 text-green-500/40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
