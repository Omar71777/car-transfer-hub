
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountDialog({ 
  open, 
  onOpenChange, 
  onConfirm 
}: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
      setConfirmText('');
    }
  };

  const isConfirmDisabled = confirmText !== 'ELIMINAR';

  return (
    <AlertDialog open={open} onOpenChange={(value) => {
      if (!isDeleting) {
        onOpenChange(value);
        if (!value) setConfirmText('');
      }
    }}>
      <AlertDialogContent className="max-w-[min(450px,90vw)]">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de eliminar tu cuenta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible. Se eliminarán permanentemente todos tus datos, 
            incluyendo tu perfil, transfers, gastos y toda la información asociada a tu cuenta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <p className="text-sm font-medium mb-2">
            Escribe "ELIMINAR" para confirmar:
          </p>
          <Input 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="ELIMINAR"
            disabled={isDeleting}
          />
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting || isConfirmDisabled}
          >
            {isDeleting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar cuenta'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
