
import React from 'react';
import { CollaboratorField } from '../form-fields/CollaboratorField';

interface CollaboratorTabProps {
  collaborators: any[];
}

export function CollaboratorTab({ collaborators }: CollaboratorTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Colaborador</h3>
      <CollaboratorField collaborators={collaborators} />
    </div>
  );
}
