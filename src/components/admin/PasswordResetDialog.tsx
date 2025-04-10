
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const passwordFormSchema = z.object({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onSubmit: (values: PasswordFormValues) => Promise<void>;
}

export function PasswordResetDialog({ open, onOpenChange, user, onSubmit }: PasswordResetDialogProps) {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  React.useEffect(() => {
    form.reset({ password: '' });
  }, [user, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para {user?.email}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
  );
}
