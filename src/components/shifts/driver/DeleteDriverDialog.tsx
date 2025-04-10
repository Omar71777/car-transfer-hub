
import React, { useState } from 'react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle, Loader } from 'lucide-react';
import { Driver } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DeleteDriverDialogProps {
  driver: Driver;
  onDelete: (id: string) => void;
}

export function DeleteDriverDialog({ driver, onDelete }: DeleteDriverDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    setIsDeleting(true);
    
    // Simulate a short delay for better UX
    setTimeout(() => {
      try {
        onDelete(driver.id);
        toast({
          title: "Conductor eliminado",
          description: `${driver.name} ha sido eliminado correctamente.`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el conductor. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setOpen(false);
      }
    }, 500);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Eliminar</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive mx-auto" />
          <AlertDialogTitle className="text-center">¿Eliminar a {driver.name}?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Esta acción eliminará al conductor <strong>{driver.name}</strong> del sistema. 
            <br />
            Todos los turnos asignados a este conductor quedarán sin asignar.
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
