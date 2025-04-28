
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, AlertCircle } from 'lucide-react';

interface CreateClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  clientName: string;
  onClientNameChange: (value: string) => void;
  clientEmail: string;
  onClientEmailChange: (value: string) => void;
  isCreating: boolean;
  error: string | null;
}

export function CreateClientDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  clientName,
  onClientNameChange,
  clientEmail,
  onClientEmailChange,
  isCreating,
  error
}: CreateClientDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nombre *</Label>
            <Input 
              id="clientName" 
              value={clientName} 
              onChange={(e) => onClientNameChange(e.target.value)}
              placeholder="Nombre del cliente" 
              required 
              disabled={isCreating}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="clientEmail">Email</Label>
            <Input 
              id="clientEmail" 
              type="email" 
              value={clientEmail} 
              onChange={(e) => onClientEmailChange(e.target.value)}
              placeholder="Email del cliente"
              disabled={isCreating}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : 'Añadir Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
