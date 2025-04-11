
import React, { useMemo } from 'react';
import { Transfer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay, isSameMonth, isSameYear, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransferStatsProps {
  transfers: Transfer[];
}

export function TransferStats({ transfers }: TransferStatsProps) {
  const stats = useMemo(() => {
    const today = new Date();
    
    // Initial stats
    const result = {
      totalTransfers: transfers.length,
      transfersToday: 0,
      transfersThisMonth: 0,
      transfersThisYear: 0,
      totalDispos: 0,
      totalTransfersOnly: 0,
      uniqueClients: new Set<string>(),
      uniqueCollaborators: new Set<string>()
    };
    
    // Process each transfer
    transfers.forEach(transfer => {
      try {
        const transferDate = parseISO(transfer.date);
        
        // Count transfers by period
        if (isSameDay(transferDate, today)) {
          result.transfersToday++;
        }
        
        if (isSameMonth(transferDate, today)) {
          result.transfersThisMonth++;
        }
        
        if (isSameYear(transferDate, today)) {
          result.transfersThisYear++;
        }
        
        // Count by service type
        if (transfer.serviceType === 'dispo') {
          result.totalDispos++;
        } else {
          result.totalTransfersOnly++;
        }
        
        // Count unique clients and collaborators
        if (transfer.clientId) {
          result.uniqueClients.add(transfer.clientId);
        }
        
        if (transfer.collaborator) {
          result.uniqueCollaborators.add(transfer.collaborator);
        }
      } catch (error) {
        console.error('Error processing transfer date:', error);
      }
    });
    
    return {
      ...result,
      uniqueClientCount: result.uniqueClients.size,
      uniqueCollaboratorCount: result.uniqueCollaborators.size
    };
  }, [transfers]);
  
  const currentMonth = useMemo(() => {
    return format(new Date(), 'MMMM', { locale: es });
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Transfers por Periodo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Hoy:</span>
              <span className="text-xs font-medium">{stats.transfersToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Este mes ({currentMonth}):</span>
              <span className="text-xs font-medium">{stats.transfersThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Este año:</span>
              <span className="text-xs font-medium">{stats.transfersThisYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Total:</span>
              <span className="text-xs font-medium">{stats.totalTransfers}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Por Tipo de Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Transfers:</span>
              <span className="text-xs font-medium">{stats.totalTransfersOnly}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Disposiciones:</span>
              <span className="text-xs font-medium">{stats.totalDispos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Ratio Transfer/Dispo:</span>
              <span className="text-xs font-medium">
                {stats.totalDispos > 0 
                  ? (stats.totalTransfersOnly / stats.totalDispos).toFixed(2) 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Clientes y Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Clientes únicos:</span>
              <span className="text-xs font-medium">{stats.uniqueClientCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Colaboradores:</span>
              <span className="text-xs font-medium">{stats.uniqueCollaboratorCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Media transfers por cliente:</span>
              <span className="text-xs font-medium">
                {stats.uniqueClientCount > 0 
                  ? (stats.totalTransfers / stats.uniqueClientCount).toFixed(2) 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
