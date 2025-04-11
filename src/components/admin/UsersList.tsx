
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Shield, UserCircle, Edit, Key, Trash, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UsersListProps {
  users: Profile[];
  currentUserId: string | undefined;
  onEditUser: (user: Profile) => void;
  onResetPassword: (user: Profile) => void;
  onToggleRole: (userId: string, currentRole: 'admin' | 'user') => void;
  onDeleteUser: (user: Profile) => void;
  loading: boolean;
}

export function UsersList({ 
  users, 
  currentUserId, 
  onEditUser, 
  onResetPassword, 
  onToggleRole,
  onDeleteUser,
  loading
}: UsersListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead className="w-[80px] text-center">Rol</TableHead>
          <TableHead>Fecha de registro</TableHead>
          <TableHead className="w-[60px] text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Cargando usuarios...
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No hay usuarios registrados
            </TableCell>
          </TableRow>
        ) : (
          users.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.email}</TableCell>
              <TableCell>
                {profile.first_name && profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'No completado'}
              </TableCell>
              <TableCell className="text-center">
                {profile.role === 'admin' ? (
                  <Shield className="h-5 w-5 text-primary mx-auto" title="Administrador" />
                ) : (
                  <UserCircle className="h-5 w-5 text-muted-foreground mx-auto" title="Usuario" />
                )}
              </TableCell>
              <TableCell>
                {format(new Date(profile.created_at), 'PPP', { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditUser(profile)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onResetPassword(profile)}>
                      <Key className="h-4 w-4 mr-2" />
                      Resetear contraseña
                    </DropdownMenuItem>
                    
                    {profile.id !== currentUserId && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => onToggleRole(profile.id, profile.role)}
                          disabled={profile.id === currentUserId}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {profile.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteUser(profile)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
