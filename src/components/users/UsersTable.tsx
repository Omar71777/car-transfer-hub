
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDateFromTimestamp } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
}

interface UsersTableProps {
  users: User[];
  onViewUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}

export function UsersTable({
  users,
  onViewUser,
  onEditUser,
  onDeleteUser
}: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[120px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No hay usuarios para mostrar
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-sm">
                  {user.first_name || user.last_name ? (
                    <div>
                      <span>{user.first_name} {user.last_name}</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        Creado el {formatDateFromTimestamp(user.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-muted-foreground">Sin nombre</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        Creado el {formatDateFromTimestamp(user.created_at)}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell className="text-sm">
                  {user.role === 'admin' ? (
                    <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                      Administrador
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted/50">
                      Usuario
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {user.status === 'active' ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      Activo
                    </Badge>
                  ) : user.status === 'pending' ? (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">
                      Pendiente
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Inactivo
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onViewUser && (
                        <DropdownMenuItem onClick={() => onViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalles</span>
                        </DropdownMenuItem>
                      )}
                      {onEditUser && (
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                      )}
                      {onDeleteUser && (
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteUser(user.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
