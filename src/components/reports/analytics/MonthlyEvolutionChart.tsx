
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

interface MonthlyEvolutionChartProps {
  data: Array<{
    name: string;
    ingresos: number;
    gastos: number;
    comisiones: number;
    beneficio: number;
  }>;
  loading: boolean;
}

export function MonthlyEvolutionChart({ data, loading }: MonthlyEvolutionChartProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value}€`} />
        <Legend />
        <Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" />
        <Bar dataKey="gastos" name="Gastos" fill="#ef4444" />
        <Bar dataKey="comisiones" name="Comisiones" fill="#f59e0b" />
        <Bar dataKey="beneficio" name="Beneficio" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
