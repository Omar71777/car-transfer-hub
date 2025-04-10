
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { DeleteAccountDialog } from '@/components/profile/DeleteAccountDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { Loader, UserX } from 'lucide-react';

const ProfilePage = () => {
  const { profile, isLoading, updateUserProfile, deleteAccount } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full py-12">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-ibiza-900">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información de perfil</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tus datos personales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm 
                defaultValues={{
                  email: profile?.email || '',
                  first_name: profile?.first_name || '',
                  last_name: profile?.last_name || ''
                }}
                onSubmit={updateUserProfile}
              />
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Zona de Peligro</CardTitle>
              <CardDescription className="text-red-600">
                Las siguientes acciones no se pueden deshacer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <UserX className="mr-2 h-4 w-4" />
                Eliminar mi cuenta
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Al eliminar tu cuenta, todos tus datos serán borrados permanentemente.
              </p>
            </CardContent>
          </Card>
        </div>

        <DeleteAccountDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={async () => {
            const success = await deleteAccount();
            if (success) {
              navigate('/auth');
            }
          }}
        />
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
