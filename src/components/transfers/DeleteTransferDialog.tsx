
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
import { Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DeleteTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  isMultiple: boolean;
  count?: number;
}

export function DeleteTransferDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  isMultiple,
  count = 0
}: DeleteTransferDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isMobile = useIsMobile();

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await onConfirm();
      if (result) {
        onOpenChange(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const title = isMultiple 
    ? `¿Estás seguro de eliminar ${count} transfers?` 
    : '¿Estás seguro de eliminar este transfer?';
  
  const description = isMultiple
    ? "Esta acción eliminará todos los transfers seleccionados y sus gastos asociados. Esta acción no se puede deshacer."
    : "Esta acción eliminará el transfer y sus gastos asociados. Esta acción no se puede deshacer.";

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(value) => {
        if (!isDeleting) {
          onOpenChange(value);
        }
      }}
    >
      <AlertDialogContent 
        className={`dialog-content max-w-[min(450px,90vw)] ${isMobile ? 'mobile-dialog' : ''}`}
      >
        <AlertDialogHeader className={isMobile ? 'dialog-header' : ''}>
          <AlertDialogTitle className={isMobile ? 'text-base' : ''}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className={isMobile ? 'text-sm' : ''}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className={`gap-2 ${isMobile ? 'dialog-footer flex-col' : ''}`}>
          <AlertDialogCancel 
            disabled={isDeleting}
            className={isMobile ? 'w-full mt-0' : ''}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={`bg-destructive text-destructive-foreground hover:bg-destructive/90 ${isMobile ? 'w-full min-h-[44px]' : ''}`}
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
