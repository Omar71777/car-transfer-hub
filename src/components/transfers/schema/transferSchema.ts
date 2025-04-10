
import * as z from 'zod';

export const transferSchema = z.object({
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  time: z.string().optional(),
  origin: z.string().min(1, { message: 'El origen es requerido' }),
  destination: z.string().min(1, { message: 'El destino es requerido' }),
  price: z.string().min(1, { message: 'El precio es requerido' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: 'El precio debe ser un número positivo' }
  ),
  collaborator: z.string().optional(),
  commission: z.string().min(1, { message: 'La comisión es requerida' }).refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0, 
    { message: 'La comisión debe ser un número positivo o cero' }
  ),
  paymentStatus: z.enum(['paid', 'pending'], {
    required_error: 'El estado de pago es requerido',
  }),
});

export type TransferFormValues = z.infer<typeof transferSchema>;
