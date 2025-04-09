
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Shield, UserCircle, XCircle, CheckCircle } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToUpdateRole, setUserToUpdateRole] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('No tienes permisos para acceder a esta página');
    }
  }, [isAdmin, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data as Profile[]);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast.error('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const toggleUserRole = async (userId: string, currentRole: 'admin' | 'user') => {
    try {
      // Don't allow changing your own role
      if (userId === user?.id) {
        toast.error('No puedes cambiar tu propio rol');
        return;
      }

      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success(`Usuario actualizado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`);
    } catch (error: any) {
      console.error('Error toggling user role:', error);
      toast.error('Error al actualizar el rol del usuario');
    } finally {
      setUserToUpdateRole(null);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-8">Administración de Usuarios</h1>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>
              Gestiona los roles de los usuarios de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando usuarios...</div>
            ) : (
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
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hay usuarios registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : 'No completado'}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {user.role === 'admin' ? (
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
                          {format(new Date(user.created_at), 'PPP', { locale: es })}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setUserToUpdateRole(user.id)}
                                disabled={user.id === user.id}
                              >
                                {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {user.role === 'admin' 
                                    ? '¿Quitar permisos de administrador?' 
                                    : '¿Convertir en administrador?'
                                  }
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {user.role === 'admin'
                                    ? 'Este usuario perderá todos los permisos de administración.'
                                    : 'Este usuario tendrá acceso completo a todas las funciones de administración.'
                                  }
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => toggleUserRole(user.id, user.role)}
                                >
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
