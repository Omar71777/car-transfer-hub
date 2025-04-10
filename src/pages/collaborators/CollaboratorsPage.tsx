
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollaboratorCard } from '@/components/collaborators/CollaboratorCard';
import { CollaboratorsOverview } from '@/components/collaborators/CollaboratorsOverview';
import { Transfer } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

// Datos de ejemplo para fallback
const dummyTransfers: Transfer[] = [
  {
    id: '1',
    date: '2025-04-09',
    time: '09:30',
    origin: 'Aeropuerto de Ibiza',
    destination: 'Hotel Ushuaïa',
    price: 85,
    collaborator: 'Carlos Sánchez',
    commission: 10,
    expenses: []
  },
  {
    id: '2',
    date: '2025-04-09',
    time: '14:45',
    origin: 'Hotel Pacha',
    destination: 'Playa d\'en Bossa',
    price: 65,
    collaborator: 'María López',
    commission: 15,
    expenses: []
  }
];

const CollaboratorsPage = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [collaboratorStats, setCollaboratorStats] = useState<any[]>([]);

  useEffect(() => {
    // Cargar transfers desde localStorage
    const storedTransfers = localStorage.getItem('transfers');
    const loadedTransfers = storedTransfers ? JSON.parse(storedTransfers) : dummyTransfers;
    setTransfers(loadedTransfers);

    // Calcular estadísticas de colaboradores
    const stats: Record<string, { 
      name: string, 
      transferCount: number, 
      commissionTotal: number,
      transfers: Transfer[]
    }> = {};
    
    loadedTransfers.forEach((transfer: Transfer) => {
      if (!transfer.collaborator) return;
      
      const commissionAmount = (transfer.price * transfer.commission) / 100;
      
      if (!stats[transfer.collaborator]) {
        stats[transfer.collaborator] = {
          name: transfer.collaborator,
          transferCount: 0,
          commissionTotal: 0,
          transfers: []
        };
      }
      
      stats[transfer.collaborator].transferCount += 1;
      stats[transfer.collaborator].commissionTotal += commissionAmount;
      stats[transfer.collaborator].transfers.push(transfer);
    });
    
    const collaboratorsData = Object.values(stats).map(collab => ({
      ...collab,
      averageCommission: collab.commissionTotal / collab.transferCount || 0
    }));
    
    // Ordenar por comisión total descendente
    collaboratorsData.sort((a, b) => b.commissionTotal - a.commissionTotal);
    
    setCollaboratorStats(collaboratorsData);
  }, []);

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-primary">Colaboradores</h1>
          <p className="text-muted-foreground">Gestión y análisis de colaboradores</p>
        </div>

        {/* Collaborators Overview */}
        <div className="mb-8">
          <CollaboratorsOverview transfers={transfers} />
        </div>

        {/* Collaborator Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rendimiento por Colaborador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaboratorStats.map((collab) => (
              <CollaboratorCard
                key={collab.name}
                name={collab.name}
                transferCount={collab.transferCount}
                commissionTotal={collab.commissionTotal}
                averageCommission={collab.averageCommission}
              />
            ))}
            {collaboratorStats.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No hay datos de colaboradores disponibles
              </div>
            )}
          </div>
        </div>

        {/* Detailed Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Detalles de Transfers por Colaborador</CardTitle>
            <CardDescription>Listado detallado de todos los transfers asignados a colaboradores</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Origen - Destino</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Comisión %</TableHead>
                  <TableHead className="text-right">Total Comisión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.filter(t => !!t.collaborator).map((transfer) => {
                  const commissionAmount = (transfer.price * transfer.commission) / 100;
                  return (
                    <TableRow key={transfer.id}>
                      <TableCell>{transfer.date}</TableCell>
                      <TableCell>{transfer.collaborator}</TableCell>
                      <TableCell>{transfer.origin} - {transfer.destination}</TableCell>
                      <TableCell className="text-right">{formatCurrency(transfer.price)}</TableCell>
                      <TableCell className="text-right">{transfer.commission}%</TableCell>
                      <TableCell className="text-right font-medium text-amber-500">{formatCurrency(commissionAmount)}</TableCell>
                    </TableRow>
                  );
                })}
                {transfers.filter(t => !!t.collaborator).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No hay transfers asignados a colaboradores
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CollaboratorsPage;
