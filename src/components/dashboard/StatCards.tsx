
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
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-r from-electric/90 to-electric/75 text-white group">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-electric/0 via-aqua/10 to-electric/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
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
        <div className="h-8 w-1 bg-gradient-to-b from-aqua via-electric-light to-aqua/30 rounded-full absolute right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-r from-pine-dark/90 to-pine-dark/75 text-white group">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pine-dark/0 via-aqua/10 to-pine-dark/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
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
        <div className="h-8 w-1 bg-gradient-to-b from-aqua via-pine-light to-aqua/30 rounded-full absolute right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-r from-vibrant/90 to-vibrant/75 text-white group">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-vibrant/0 via-aqua/10 to-vibrant/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
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
        <div className="h-8 w-1 bg-gradient-to-b from-aqua via-vibrant-light to-aqua/30 rounded-full absolute right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
      
      <Card className="relative overflow-hidden rounded-xl border-b border-white/10 bg-gradient-to-r from-aqua/90 to-aqua/75 text-aqua-dark group">
        {/* Animated highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-aqua/0 via-white/20 to-aqua/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-aqua-dark/90">Beneficio</h3>
            <div className="p-2 bg-aqua-dark/10 rounded-full">
              <BarChart2 className="h-5 w-5 text-aqua-dark" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(stats.netIncome)}</p>
            <div className="flex items-center text-xs text-aqua-dark/80">
              <span>Beneficio neto</span>
              {stats.netIncome > 0 && (
                <ArrowRight className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
        </CardContent>
        <div className="h-8 w-1 bg-gradient-to-b from-electric via-aqua to-electric/30 rounded-full absolute right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
      </Card>
    </div>
  );
};
