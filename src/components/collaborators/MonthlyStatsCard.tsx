
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyCollaboratorStatsTable } from './MonthlyCollaboratorStatsTable';
import { MonthlyCollaboratorStats } from './types';

interface MonthlyStatsCardProps {
  monthlyStats: MonthlyCollaboratorStats[];
}

export function MonthlyStatsCard({ monthlyStats }: MonthlyStatsCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Comisiones Mensuales por Colaborador</CardTitle>
        <CardDescription>Resumen mensual de transfers y comisiones por colaborador</CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlyCollaboratorStatsTable monthlyStats={monthlyStats} />
      </CardContent>
    </Card>
  );
}
