
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ClientData } from '@/hooks/reports/useAnalyticsData';
import { formatCurrency } from '@/lib/utils';

interface ClientsTabProps {
  clientData: ClientData[];
  loading: boolean;
  isMobile: boolean;
}

export function ClientsTab({ clientData, loading, isMobile }: ClientsTabProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Ingresos por Cliente</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Cargando datos...</p>
            </div>
          ) : clientData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p>No hay datos disponibles</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientData.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobile}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={!isMobile && ((entry) => `${entry.name}: ${formatCurrency(entry.value)}`)}
                >
                  {clientData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientTopTable clientData={clientData} isMobile={isMobile} />
        </CardContent>
      </Card>
    </div>
  );
}

interface ClientTopTableProps {
  clientData: ClientData[];
  isMobile: boolean;
}

function ClientTopTable({ clientData, isMobile }: ClientTopTableProps) {
  return (
    <div className={isMobile ? "overflow-x-auto -mx-4 px-4 mobile-scroll" : ""}>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Cliente</th>
            <th className="text-right py-2">Transfers</th>
            <th className="text-right py-2">Importe Total</th>
            <th className="text-right py-2">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {clientData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-muted-foreground">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            clientData.slice(0, 10).map((client, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{client.name}</td>
                <td className="py-2 text-right">{client.count}</td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(client.value)}
                </td>
                <td className="py-2 text-right">
                  {formatCurrency(client.value / client.count)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
