
import React from 'react';

interface CollaboratorInfoSectionProps {
  values: any;
  commissionAmountEuros: number;
  formatCurrency: (amount: number) => string;
}

export function CollaboratorInfoSection({ 
  values, 
  commissionAmountEuros, 
  formatCurrency 
}: CollaboratorInfoSectionProps) {
  if (!values.collaborator || values.collaborator === 'none') return null;
  
  return (
    <div>
      <h3 className="font-medium text-lg">Información del colaborador</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <p className="text-sm text-muted-foreground">Nombre del colaborador</p>
          <p>{values.collaborator}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Comisión</p>
          <p>
            {values.commission} {values.commissionType === 'percentage' ? '%' : '€'}
            {values.commissionType === 'percentage' && (
              <span className="ml-1 text-sm text-muted-foreground">
                ({formatCurrency(commissionAmountEuros)})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
