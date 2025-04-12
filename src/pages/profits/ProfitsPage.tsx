
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfitCalculator } from '@/components/profits/ProfitCalculator';
import { SummaryStats } from '@/components/profits/SummaryStats';
import { ChartsSection } from '@/components/profits/ChartsSection';
import { ExportOptions } from '@/components/profits/ExportOptions';
import { ProfitFilters } from '@/components/profits/ProfitFilters';
import { useProfitsData } from '@/hooks/useProfitsData';

const ProfitsPage = () => {
  const {
    transfers,
    expenses,
    stats,
    chartData,
    monthlyData,
    loading,
    updateFilters,
    resetFilters,
    uniqueCollaborators,
    uniqueExpenseTypes
  } = useProfitsData();
  
  return (
    <MainLayout>
      <div className="py-4 md:py-6 px-2 md:px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-primary">Ganancias</h1>
            <p className="text-muted-foreground">Analiza tus ingresos, gastos y beneficios</p>
          </div>
          
          {/* Export Options */}
          <div className="flex justify-end">
            <ExportOptions transfers={transfers} expenses={expenses} stats={stats} />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 md:mb-6">
          <ProfitFilters 
            collaborators={uniqueCollaborators} 
            expenseTypes={uniqueExpenseTypes} 
            onFilterChange={updateFilters} 
            onResetFilters={resetFilters} 
          />
        </div>

        {/* Summary Stats */}
        <div className="mb-6 md:mb-8">
          <SummaryStats stats={stats} />
        </div>
        
        {/* Charts */}
        <div className="mb-6 md:mb-8">
          <ChartsSection chartData={chartData} monthlyData={monthlyData} />
        </div>
        
        {/* Profit Calculator */}
        <div className="mb-6 md:mb-8">
          <ProfitCalculator transfers={transfers} expenses={expenses} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfitsPage;
