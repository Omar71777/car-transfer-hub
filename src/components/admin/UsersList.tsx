
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Shield, UserCircle, Edit, Key } from 'lucide-react';
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
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UsersListProps {
  users: Profile[];
  currentUserId: string | undefined;
  onEditUser: (user: Profile) => void;
  onResetPassword: (user: Profile) => void;
  onToggleRole: (userId: string, currentRole: 'admin' | 'user') => void;
  loading: boolean;
}

export function UsersList({ 
  users, 
  currentUserId, 
  onEditUser, 
  onResetPassword, 
  onToggleRole,
  loading
}: UsersListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Fecha de registro</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
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
              <TableCell>
                <span className="flex items-center gap-1">
                  {profile.role === 'admin' ? (
                    <>
                      <Shield className="h-4 w-4 text-primary" />
                      Administrador
                    </>
                  ) : (
                    <>
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      Usuario
                    </>
                  )}
                </span>
              </TableCell>
              <TableCell>
                {format(new Date(profile.created_at), 'PPP', { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditUser(profile)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onResetPassword(profile)}
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Contraseña
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={profile.id === currentUserId}
                      >
                        {profile.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {profile.role === 'admin' 
                            ? '¿Quitar permisos de administrador?' 
                            : '¿Convertir en administrador?'
                          }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {profile.role === 'admin'
                            ? 'Este usuario perderá todos los permisos de administración.'
                            : 'Este usuario tendrá acceso completo a todas las funciones de administración.'
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onToggleRole(profile.id, profile.role)}
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
