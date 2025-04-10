
import React from 'react';
import { CollaboratorCard } from './CollaboratorCard';
import { CollaboratorStat } from './types';

interface CollaboratorStatsSectionProps {
  collaboratorStats: CollaboratorStat[];
}

export function CollaboratorStatsSection({ collaboratorStats }: CollaboratorStatsSectionProps) {
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
