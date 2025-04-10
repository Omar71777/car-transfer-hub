
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bill, TaxApplicationType } from '@/types/billing';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Plus, Minus } from 'lucide-react';
import { useTransfers } from '@/hooks/useTransfers';
import { Transfer } from '@/types';

const billEditSchema = z.object({
  number: z.string().min(1, { message: 'El número de factura es requerido' }),
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  due_date: z.string().min(1, { message: 'La fecha de vencimiento es requerida' }),
  tax_rate: z.coerce.number().min(0, { message: 'El IVA debe ser un número positivo' }).default(10),
  tax_application: z.enum(['included', 'excluded'], {
    required_error: 'Debe seleccionar cómo aplicar el IVA',
  }).default('excluded'),
  notes: z.string().optional(),
});

type BillEditFormValues = z.infer<typeof billEditSchema>;

interface BillEditFormProps {
  bill: Bill;
  onSubmit: (values: Partial<Bill>, addedTransferIds: string[], removedTransferIds: string[]) => Promise<void>;
}

export function BillEditForm({ bill, onSubmit }: BillEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transfersToAdd, setTransfersToAdd] = useState<string[]>([]);
  const [transfersToRemove, setTransfersToRemove] = useState<string[]>([]);
  const { transfers, fetchTransfers } = useTransfers();
  
  // Get available (unbilled) transfers
  const [availableTransfers, setAvailableTransfers] = useState<Transfer[]>([]);
  // Current transfers in the bill
  const [currentTransfers, setCurrentTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  useEffect(() => {
    // Filter out already billed transfers except those belonging to this bill
    const availableT = transfers.filter(t => !t.billed || bill.items?.some(item => item.transfer_id === t.id));
    setAvailableTransfers(availableT);
    
    // Get current transfers in this bill
    if (bill.items) {
      const currentT = transfers.filter(t => bill.items?.some(item => item.transfer_id === t.id));
      setCurrentTransfers(currentT);
    }
  }, [transfers, bill]);

  const form = useForm<BillEditFormValues>({
    resolver: zodResolver(billEditSchema),
    defaultValues: {
      number: bill.number,
      date: bill.date,
      due_date: bill.due_date,
      tax_rate: bill.tax_rate,
      tax_application: bill.tax_application as TaxApplicationType,
      notes: bill.notes || '',
    },
  });

  const handleSubmit = async (values: BillEditFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, transfersToAdd, transfersToRemove);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTransferToAdd = (transferId: string) => {
    setTransfersToAdd(prev => {
      if (prev.includes(transferId)) {
        return prev.filter(id => id !== transferId);
      } else {
        return [...prev, transferId];
      }
    });
  };

  const toggleTransferToRemove = (transferId: string) => {
    setTransfersToRemove(prev => {
      if (prev.includes(transferId)) {
        return prev.filter(id => id !== transferId);
      } else {
        return [...prev, transferId];
      }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Get transfers that can be added (aren't in the bill yet and aren't marked to remove)
  const getAddableTransfers = () => {
    return availableTransfers.filter(t => 
      !currentTransfers.some(ct => ct.id === t.id) && 
      !transfersToAdd.includes(t.id)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de factura</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de emisión</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de vencimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="tax_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IVA (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_application"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Aplicación del IVA</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excluded" id="tax-excluded" />
                      <Label htmlFor="tax-excluded">Añadir IVA al precio (10€ + 10% = 11€)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="included" id="tax-included" />
                      <Label htmlFor="tax-included">IVA incluido en el precio (10€ incluye 10% IVA)</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Información adicional para la factura"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transfers management section */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Transfers actuales</h3>
          {currentTransfers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay transfers en esta factura</p>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {currentTransfers.map(transfer => (
                <div 
                  key={transfer.id} 
                  className={`flex items-center justify-between p-2 border rounded-md ${
                    transfersToRemove.includes(transfer.id) ? 'bg-red-50 border-red-200' : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transfer.origin} → {transfer.destination}</p>
                    <p className="text-xs text-muted-foreground">Fecha: {transfer.date} • Precio: {formatCurrency(transfer.price)}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant={transfersToRemove.includes(transfer.id) ? "default" : "destructive"} 
                    size="sm"
                    onClick={() => toggleTransferToRemove(transfer.id)}
                  >
                    {transfersToRemove.includes(transfer.id) ? (
                      <>Restaurar</>
                    ) : (
                      <><Minus className="h-4 w-4 mr-1" /> Quitar</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Añadir transfers</h3>
          
          {/* Display transfers to add */}
          {transfersToAdd.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium">Transfers seleccionados para añadir:</h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {transfersToAdd.map(transferId => {
                  const transfer = availableTransfers.find(t => t.id === transferId);
                  if (!transfer) return null;
                  
                  return (
                    <div key={transfer.id} className="flex items-center justify-between p-2 border rounded-md bg-green-50 border-green-200">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{transfer.origin} → {transfer.destination}</p>
                        <p className="text-xs text-muted-foreground">Fecha: {transfer.date} • Precio: {formatCurrency(transfer.price)}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleTransferToAdd(transfer.id)}
                      >
                        <Minus className="h-4 w-4 mr-1" /> Quitar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Available transfers to add */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Transfers disponibles:</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {getAddableTransfers().length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay transfers disponibles para añadir</p>
              ) : (
                getAddableTransfers().map(transfer => (
                  <div key={transfer.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{transfer.origin} → {transfer.destination}</p>
                      <p className="text-xs text-muted-foreground">Fecha: {transfer.date} • Precio: {formatCurrency(transfer.price)}</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleTransferToAdd(transfer.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Añadir
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
