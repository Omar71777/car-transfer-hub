
import React from 'react';
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';

interface CollaboratorDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  loading: boolean;
}

export function CollaboratorDistributionChart({ data, loading }: CollaboratorDistributionChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#83a6ed'];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-80">
        <p>No hay datos de colaboradores disponibles</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}€`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
