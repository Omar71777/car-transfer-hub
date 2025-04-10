
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

const companyProfileSchema = z.object({
  company_name: z.string().optional(),
  company_address: z.string().optional(),
  company_tax_id: z.string().optional(),
  company_phone: z.string().optional(),
  company_email: z.string().email('Ingresa un email válido').optional().or(z.literal('')),
  company_logo: z.string().optional(),
});

type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;

interface CompanyProfileFormProps {
  defaultValues: CompanyProfileFormValues;
  onSubmit: (values: CompanyProfileFormValues) => Promise<void>;
}

export function CompanyProfileForm({ defaultValues, onSubmit }: CompanyProfileFormProps) {
  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: CompanyProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de su empresa" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_tax_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CIF/NIF</FormLabel>
              <FormControl>
                <Input placeholder="B12345678" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección de su empresa" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de contacto</FormLabel>
                <FormControl>
                  <Input placeholder="+34 123 456 789" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de contacto</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="empresa@ejemplo.com" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company_logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Logo (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://ejemplo.com/logo.png" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Guardando...' : 'Guardar información de empresa'}
        </Button>
      </form>
    </Form>
  );
}
