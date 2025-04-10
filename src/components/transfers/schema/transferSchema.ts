
import * as z from 'zod';

export const transferSchema = z.object({
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  time: z.string().optional(),
  serviceType: z.enum(['transfer', 'dispo'], { 
    required_error: 'El tipo de servicio es requerido' 
  }).default('transfer'),
  origin: z.string().min(1, { message: 'El origen es requerido' }),
  destination: z.string().optional()
    .superRefine((val, ctx) => {
      // Get the serviceType from the form data
      const formData = ctx.path.length > 0 ? ctx : { parent: { serviceType: 'transfer' } };
      const serviceType = formData.parent?.serviceType;
        
      if (serviceType === 'transfer' && (!val || val.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El destino es requerido para transfers'
        });
        return false;
      }
      return true;
    }),
  hours: z.string().optional()
    .superRefine((val, ctx) => {
      // Get the serviceType from the form data
      const formData = ctx.path.length > 0 ? ctx : { parent: { serviceType: 'transfer' } };
      const serviceType = formData.parent?.serviceType;
        
      if (serviceType === 'dispo' && (!val || val.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Las horas son requeridas para disposiciones'
        });
        return false;
      }
      return true;
    }),
  price: z.string().min(1, { message: 'El precio es requerido' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: 'El precio debe ser un número positivo' }
  ),
  discountType: z.enum(['percentage', 'fixed']).optional().nullable(),
  discountValue: z.string().optional()
    .refine(
      (val) => val === undefined || val === '' || (!isNaN(Number(val)) && Number(val) >= 0), 
      { message: 'El descuento debe ser un número positivo o cero' }
    ),
  extraCharges: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      price: z.union([z.string(), z.number()]).optional().transform(val => 
        typeof val === 'string' ? val : val?.toString()
      )
    })
  ).optional().default([]),
  collaborator: z.string().optional().default(''),
  commissionType: z.enum(['percentage', 'fixed']).default('percentage'),
  commission: z.string().optional().refine(
    (val) => val === undefined || val === '' || (!isNaN(Number(val)) && Number(val) >= 0), 
    { message: 'La comisión debe ser un número positivo o cero' }
  ),
  paymentStatus: z.enum(['paid', 'pending'], {
    required_error: 'El estado de pago es requerido',
  }),
  clientId: z.string().min(1, { message: 'El cliente es requerido' }),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
});

export type TransferFormValues = z.infer<typeof transferSchema>;
