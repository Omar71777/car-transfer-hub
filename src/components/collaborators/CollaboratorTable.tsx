
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
import { Pencil, Trash2, Phone, Mail, MoreHorizontal } from 'lucide-react';
import { Collaborator } from '@/hooks/useCollaborators';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CollaboratorTableProps {
  collaborators: Collaborator[];
  onEdit: (collaborator: Collaborator) => void;
  onDelete: (collaborator: Collaborator) => void;
}

export function CollaboratorTable({ collaborators, onEdit, onDelete }: CollaboratorTableProps) {
  const isMobile = useIsMobile();
  
  // Helper function to capitalize the first letter of a name
  const capitalizeName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const TableContent = () => (
    <Table className={isMobile ? "mobile-table" : ""}>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          {!isMobile && <TableHead>Teléfono</TableHead>}
          {!isMobile && <TableHead>Email</TableHead>}
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {collaborators.map((collaborator) => (
          <TableRow key={collaborator.id}>
            <TableCell className="font-medium">
              <div>
                {capitalizeName(collaborator.name)}
                {isMobile && collaborator.phone && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {collaborator.phone}
                  </div>
                )}
              </div>
            </TableCell>
            {!isMobile && (
              <TableCell>
                {collaborator.phone && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {collaborator.phone}
                  </div>
                )}
              </TableCell>
            )}
            {!isMobile && (
              <TableCell>
                {collaborator.email && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {collaborator.email}
                  </div>
                )}
              </TableCell>
            )}
            <TableCell className="text-right">
              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(collaborator)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => onDelete(collaborator)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(collaborator)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete(collaborator)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
        {collaborators.length === 0 && (
          <TableRow>
            <TableCell colSpan={isMobile ? 2 : 4} className="text-center py-8 text-muted-foreground">
              No hay colaboradores registrados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="table-container">
      {isMobile ? (
        <div className="overflow-x-auto px-1 w-full">
          <TableContent />
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="table-scroll-container">
            <TableContent />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
