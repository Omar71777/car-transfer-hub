
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfitCalculator } from '@/components/profits/ProfitCalculator';
import { SummaryStats } from '@/components/profits/SummaryStats';
import { ChartsSection } from '@/components/profits/ChartsSection';
import { useProfitsData } from '@/hooks/useProfitsData';

const ProfitsPage = () => {
  const { transfers, expenses, stats, chartData, monthlyData, loading } = useProfitsData();

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Ganancias</h1>
          <p className="text-muted-foreground">Analiza tus ingresos, gastos y beneficios</p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8">
          <SummaryStats stats={stats} />
        </div>
        
        {/* Charts */}
        <div className="mb-8">
          <ChartsSection chartData={chartData} monthlyData={monthlyData} />
        </div>
        
        {/* Profit Calculator */}
        <div className="mb-8">
          <ProfitCalculator transfers={transfers} expenses={expenses} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfitsPage;
