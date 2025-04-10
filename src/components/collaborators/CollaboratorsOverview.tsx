
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transfer } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Coins, UsersRound, AlertCircle } from 'lucide-react';

interface CollaboratorsOverviewProps {
  transfers: Transfer[];
}

export function CollaboratorsOverview({ transfers }: CollaboratorsOverviewProps) {
  // Calculate commissions and stats
  const calculateCommissionStats = () => {
    const collaborators: Record<string, { name: string, transferCount: number, commissionTotal: number }> = {};
    
    transfers.forEach(transfer => {
      if (!transfer.collaborator) return;
      
      const commissionAmount = (transfer.price * transfer.commission) / 100;
      
      if (!collaborators[transfer.collaborator]) {
        collaborators[transfer.collaborator] = {
          name: transfer.collaborator,
          transferCount: 0,
          commissionTotal: 0
        };
      }
      
      collaborators[transfer.collaborator].transferCount += 1;
      collaborators[transfer.collaborator].commissionTotal += commissionAmount;
    });
    
    return Object.values(collaborators);
  };
  
  const collaboratorStats = calculateCommissionStats();
  const totalCommissions = collaboratorStats.reduce((sum, collab) => sum + collab.commissionTotal, 0);
  const totalTransfers = collaboratorStats.reduce((sum, collab) => sum + collab.transferCount, 0);
  
  // Prepare chart data
  const chartData = collaboratorStats.map(collab => ({
    name: collab.name,
    value: collab.commissionTotal
  }));
  
  // Random colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Check if there's no data
  const noDataAvailable = collaboratorStats.length === 0;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">Resumen de Colaboradores</CardTitle>
        <CardDescription>Distribución de comisiones entre los colaboradores</CardDescription>
      </CardHeader>
      <CardContent>
        {noDataAvailable ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground/60" />
            <p className="text-lg font-medium">No hay datos de comisiones disponibles</p>
            <p className="text-sm mt-2">Asigna transfers a colaboradores para ver estadísticas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Comisión']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-6">
              <Card className="bg-primary/5 border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Colaboradores</p>
                      <h3 className="text-2xl font-bold text-primary mt-1">{collaboratorStats.length}</h3>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <UsersRound className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-500/5 border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Comisiones</p>
                      <h3 className="text-2xl font-bold text-amber-500 mt-1">{formatCurrency(totalCommissions)}</h3>
                    </div>
                    <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Coins className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-sm text-muted-foreground text-center">
                Comisión media por transfer: <span className="font-medium">{totalTransfers > 0 ? formatCurrency(totalCommissions / totalTransfers) : '0.00€'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
