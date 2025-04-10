
import React from 'react';
import { CollaboratorCard } from './CollaboratorCard';
import { CollaboratorStat } from './types';
import { Transfer } from '@/types';
import { Loader2 } from 'lucide-react';

interface CollaboratorStatsSectionProps {
  transfers: Transfer[];
  loading?: boolean;
}

export function CollaboratorStatsSection({ transfers, loading = false }: CollaboratorStatsSectionProps) {
  // Calculate collaborator stats from transfers
  const calculateCollaboratorStats = (): CollaboratorStat[] => {
    const collaboratorStats: Record<string, CollaboratorStat> = {};
    
    // Filter out transfers without collaborators first
    const transfersWithCollaborators = transfers.filter(transfer => 
      transfer.collaborator && transfer.collaborator.trim() !== ''
    );
    
    transfersWithCollaborators.forEach(transfer => {
      if (!transfer.collaborator) return;
      
      const commissionAmount = (transfer.price * transfer.commission) / 100;
      
      if (!collaboratorStats[transfer.collaborator]) {
        collaboratorStats[transfer.collaborator] = {
          name: transfer.collaborator,
          transferCount: 0,
          commissionTotal: 0,
          averageCommission: 0,
          transfers: []
        };
      }
      
      collaboratorStats[transfer.collaborator].transferCount += 1;
      collaboratorStats[transfer.collaborator].commissionTotal += commissionAmount;
      collaboratorStats[transfer.collaborator].transfers = 
        collaboratorStats[transfer.collaborator].transfers 
          ? [...collaboratorStats[transfer.collaborator].transfers, transfer] 
          : [transfer];
    });
    
    // Calculate average commission
    Object.values(collaboratorStats).forEach(stat => {
      stat.averageCommission = stat.transferCount > 0 
        ? stat.commissionTotal / stat.transferCount 
        : 0;
    });
    
    return Object.values(collaboratorStats);
  };

  const collaboratorStats = calculateCollaboratorStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-10 w-10 text-primary animate-spin mr-2" />
        <p className="text-lg">Cargando estadísticas de colaboradores...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Rendimiento por Colaborador</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaboratorStats.map((collab) => (
          <CollaboratorCard
            key={collab.name}
            name={collab.name.charAt(0).toUpperCase() + collab.name.slice(1)}
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
  );
}
