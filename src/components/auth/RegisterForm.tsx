
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  first_name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  last_name: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  is_company_account: z.boolean().optional().default(false),
  user_subtype: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isSubmitting: boolean;
  selectedPlan?: string | null;
}

export const RegisterForm = ({ onSubmit, isSubmitting, selectedPlan }: RegisterFormProps) => {
  const [isCompanyAccount, setIsCompanyAccount] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      is_company_account: false,
      user_subtype: 'standard',
    },
  });

  const handleCheckboxChange = (checked: boolean) => {
    setIsCompanyAccount(checked);
    form.setValue('is_company_account', checked);
    form.setValue('user_subtype', checked ? 'company_admin' : 'standard');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ejemplo@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="is_company" 
            checked={isCompanyAccount}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="is_company">Registrarse como empresa</Label>
        </div>
        
        {isCompanyAccount && (
          <div className="p-4 bg-primary/10 rounded-md">
            <p className="text-sm mb-2">
              Al registrarse como empresa, podrá gestionar vehículos y conductores.
            </p>
            <p className="text-xs text-muted-foreground">
              Después de registrarse, podrá configurar los detalles de su empresa en su perfil.
            </p>
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Procesando...' : 'Registrarse'}
        </Button>
      </form>
    </Form>
  );
};
