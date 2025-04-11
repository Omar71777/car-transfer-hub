
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transfer } from '@/types';

interface DestinationData {
  name: string;
  value: number;
}

interface DestinationsTabProps {
  destinationsData: DestinationData[];
  transfers: Transfer[];
  loading: boolean;
  isMobile: boolean;
}

export function DestinationsTab({ destinationsData, transfers, loading, isMobile }: DestinationsTabProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Destinos Más Populares</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Cargando datos...</p>
            </div>
          ) : destinationsData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No hay datos disponibles. Registra transfers para ver estadísticas de destinos.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={destinationsData.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobile}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={!isMobile && ((entry) => `${entry.name}: ${entry.value}`)}
                >
                  {destinationsData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Destinos</CardTitle>
        </CardHeader>
        <CardContent>
          <DestinationsTable 
            destinationsData={destinationsData} 
            transfers={transfers} 
            isMobile={isMobile} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface DestinationsTableProps {
  destinationsData: DestinationData[];
  transfers: Transfer[];
  isMobile: boolean;
}

function DestinationsTable({ destinationsData, transfers, isMobile }: DestinationsTableProps) {
  const totalTransfers = transfers.length;
  
  return (
    <div className={isMobile ? "overflow-x-auto -mx-4 px-4 mobile-scroll" : ""}>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Destino</th>
            <th className="text-right py-2">Número de Viajes</th>
            <th className="text-right py-2">Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {destinationsData.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-8 text-muted-foreground">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            destinationsData.slice(0, 10).map((destination, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 capitalize">{destination.name}</td>
                <td className="py-2 text-right">{destination.value}</td>
                <td className="py-2 text-right">
                  {totalTransfers > 0 
                    ? ((destination.value / totalTransfers) * 100).toFixed(1) 
                    : "0"}%
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
