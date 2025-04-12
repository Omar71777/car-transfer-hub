
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MonthlyEvolutionChart } from '@/components/reports/analytics/MonthlyEvolutionChart';
import { MonthlyData } from '@/hooks/reports/useAnalyticsData';

interface MonthlyTabProps {
  monthlyData: MonthlyData[];
  loading: boolean;
}

export function MonthlyTab({ monthlyData, loading }: MonthlyTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <MonthlyEvolutionChart data={monthlyData} loading={loading} />
      </CardContent>
    </Card>
  );
}
