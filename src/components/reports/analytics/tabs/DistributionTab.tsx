
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CollaboratorDistributionChart } from '@/components/reports/analytics/CollaboratorDistributionChart';
import { StatsOverview } from '@/components/reports/analytics/StatsOverview';
import { Transfer, Expense } from '@/types';
import { CollaboratorData } from '@/hooks/reports/useAnalyticsData';

interface DistributionTabProps {
  collaboratorData: CollaboratorData[];
  transfers: Transfer[];
  expenses: Expense[];
  loading: boolean;
}

export function DistributionTab({ collaboratorData, transfers, expenses, loading }: DistributionTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Colaborador</CardTitle>
        </CardHeader>
        <CardContent>
          <CollaboratorDistributionChart data={collaboratorData} loading={loading} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Generales</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsOverview transfers={transfers} expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
