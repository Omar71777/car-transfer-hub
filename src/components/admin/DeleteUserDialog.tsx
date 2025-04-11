
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Database } from '@/integrations/supabase/types';
import { Loader } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onConfirm: (userId: string) => Promise<void>;
}

export function DeleteUserDialog({ 
  open, 
  onOpenChange, 
  user, 
  onConfirm 
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    if (user) {
      setIsDeleting(true);
      try {
        await onConfirm(user.id);
      } finally {
        setIsDeleting(false);
        onOpenChange(false);
      }
    }
  };

  // Only render when open is true
  if (!open || !user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[min(450px,90vw)]">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar perfil de usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará el perfil del usuario {user?.email}. 
            Ten en cuenta que la cuenta de autenticación permanecerá en el sistema, 
            pero el usuario ya no podrá acceder a la aplicación.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
