
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CollaboratorField } from '../form-fields/CollaboratorField';

interface CollaboratorStepProps {
  clients: any[];
  collaborators: any[];
  formState: any;
}

export function CollaboratorStep({ collaborators, formState }: CollaboratorStepProps) {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <CollaboratorField collaborators={collaborators} />
    </div>
  );
}
