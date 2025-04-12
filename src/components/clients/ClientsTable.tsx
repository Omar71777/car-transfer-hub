
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus } from 'lucide-react';
import { Client } from '@/types/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClientCardView } from './ClientCardView';

interface ClientsTableProps {
  clients: Client[];
  onAdd: () => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientsTable({ clients, onAdd, onEdit, onDelete }: ClientsTableProps) {
  const isMobile = useIsMobile();

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground mb-4">No hay clientes registrados.</p>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Cliente
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Cliente
        </Button>
      </div>

      {isMobile ? (
        <ClientCardView
          clients={clients}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>NIF/CIF</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell>{client.tax_id || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDelete(client)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
