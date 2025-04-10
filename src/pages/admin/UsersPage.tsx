import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { RefreshCw, UserPlus } from 'lucide-react';
import { UserFormDialog } from '@/components/admin/UserFormDialog';
import { PasswordResetDialog } from '@/components/admin/PasswordResetDialog';
import { AddUserDialog } from '@/components/admin/AddUserDialog';
import { DeleteUserDialog } from '@/components/admin/DeleteUserDialog';
import { UsersList } from '@/components/admin/UsersList';
import { useAdminUsers } from '@/hooks/useAdminUsers';
export default function UsersPage() {
  const {
    users,
    loading,
    editingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isPasswordDialogOpen,
    setIsPasswordDialogOpen,
    addUserDialogOpen,
    setAddUserDialogOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    userToDelete,
    fetchUsers,
    toggleUserRole,
    updateUser,
    resetPassword,
    createUser,
    deleteUser,
    confirmDeleteUser,
    openEditDialog,
    openPasswordDialog
  } = useAdminUsers();
  const {
    user,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('No tienes permisos para acceder a esta página');
    }
  }, [isAdmin, navigate]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, isAdmin]);
  if (!isAdmin) {
    return null;
  }
  return <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-left text-ibiza-900 text-xs mx-[11px]">Administración de Usuarios</h1>
          <div className="flex gap-2">
            <Button onClick={() => fetchUsers()} variant="outline" size="sm" className="text-xs px-[5px]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button onClick={() => setAddUserDialogOpen(true)} className="text-xs mx-[12px] px-[7px]">
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
            <UsersList users={users} currentUserId={user?.id} onEditUser={openEditDialog} onResetPassword={openPasswordDialog} onToggleRole={toggleUserRole} onDeleteUser={confirmDeleteUser} loading={loading} />
          </CardContent>
        </Card>
      </div>

      <UserFormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} user={editingUser} onSubmit={updateUser} />

      <PasswordResetDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen} user={editingUser} onSubmit={resetPassword} />

      <AddUserDialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen} onSubmit={createUser} />

      <DeleteUserDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} user={userToDelete} onConfirm={deleteUser} />
    </MainLayout>;
}