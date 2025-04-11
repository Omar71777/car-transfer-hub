
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Collaborator {
  id: string;
  name: string;
}

interface CollaboratorFilterProps {
  collaborators: Collaborator[];
  selectedCollaborator: string;
  onCollaboratorChange: (value: string) => void;
}

export function CollaboratorFilter({ 
  collaborators, 
  selectedCollaborator, 
  onCollaboratorChange 
}: CollaboratorFilterProps) {
  return (
    <Card className="mb-6">
      <CardContent className="py-4 mt-4">
        <div className="flex items-center">
          <div className="w-64">
            <Select value={selectedCollaborator} onValueChange={onCollaboratorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por colaborador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los colaboradores</SelectItem>
                {collaborators.map((collab) => (
                  <SelectItem key={collab.id} value={collab.name || `collab-${collab.id}`}>
                    {collab.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
