
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
import { Driver } from '@/types';
import { Pencil, User } from 'lucide-react';
import { DeleteDriverDialog } from './DeleteDriverDialog';

interface DriversTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function DriversTable({ drivers, onEdit, onDelete, onAddNew }: DriversTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-center mb-4">No hay conductores registrados todavía.</p>
        <Button onClick={onAddNew}>
          <User className="mr-2 h-4 w-4" />
          Añadir Conductor
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell className="font-medium">{driver.name}</TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(driver)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  
                  <DeleteDriverDialog 
                    driver={driver} 
                    onDelete={onDelete} 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
