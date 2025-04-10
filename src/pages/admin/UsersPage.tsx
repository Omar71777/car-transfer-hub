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
import { Shield, UserCircle, UserPlus, Edit, Save, RefreshCw, Key } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Profile = Database['public']['Tables']['profiles']['Row'];

const userFormSchema = z.object({
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres").optional(),
  email: z.string().email("Ingresa un email válido").optional(),
});

const passwordFormSchema = z.object({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type UserFormValues = z.infer<typeof userFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToUpdateRole, setUserToUpdateRole] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  const addUserForm = useForm<UserFormValues & PasswordFormValues>({
    resolver: zodResolver(userFormSchema.merge(passwordFormSchema)),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('No tienes permisos para acceder a esta página');
    }
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin]);

  const toggleUserRole = async (userId: string, currentRole: 'admin' | 'user') => {
    try {
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

  const openEditDialog = (profile: Profile) => {
    setEditingUser(profile);
    form.reset({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      email: profile.email || '',
    });
    setIsEditDialogOpen(true);
  };

  const openPasswordDialog = (profile: Profile) => {
    setEditingUser(profile);
    passwordForm.reset({ password: '' });
    setIsPasswordDialogOpen(true);
  };

  const onSubmit = async (values: UserFormValues) => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name || null,
          last_name: values.last_name || null,
          email: values.email || null,
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...values } : u
      ));
      
      toast.success('Usuario actualizado con éxito');
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario');
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(editingUser.email || '', {
        redirectTo: window.location.origin + '/auth?reset=true',
      });

      if (error) throw error;
      
      toast.success(`Se ha enviado un email para restablecer la contraseña a ${editingUser.email}`);
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast.error(`Error al enviar el email de restablecimiento: ${error.message}`);
    }
  };

  const onAddUserSubmit = async (values: UserFormValues & PasswordFormValues) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email!,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
          },
          emailRedirectTo: window.location.origin + '/auth?signup=true',
        }
      });

      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            role: 'user',
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error(`Error al crear el perfil: ${profileError.message}`);
          return;
        }
        
        toast.success('Usuario creado con éxito. Se ha enviado un email de verificación.');
        setAddUserDialogOpen(false);
        addUserForm.reset();
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(`Error al crear el usuario: ${error.message}`);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Administración de Usuarios</h1>
          <div className="flex gap-2">
            <Button onClick={() => fetchUsers()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button onClick={() => setAddUserDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Añadir Usuario
            </Button>
          </div>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>
              Gestiona los usuarios de la aplicación
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
                              onClick={() => openEditDialog(profile)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openPasswordDialog(profile)}
                            >
                              <Key className="h-4 w-4 mr-1" />
                              Contraseña
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setUserToUpdateRole(profile.id)}
                                  disabled={profile.id === user?.id}
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
                                    onClick={() => toggleUserRole(profile.id, profile.role)}
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
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualiza la información del usuario
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Establece una nueva contraseña para {editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nueva contraseña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Key className="h-4 w-4 mr-2" />
                  Actualizar Contraseña
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear un nuevo usuario
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addUserForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addUserForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Contraseña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddUserDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
