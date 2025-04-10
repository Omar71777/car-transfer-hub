import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useClients } from '@/hooks/useClients';
import { useBilling } from '@/hooks/useBilling';
import { useTransfers } from '@/hooks/useTransfers';
import { BillPreview, CreateBillDto, TaxApplicationType } from '@/types/billing';
import { Client } from '@/types/client';
import { Transfer } from '@/types';
import { Filter, Search } from 'lucide-react';

const billSchema = z.object({
  clientId: z.string().min(1, { message: 'El cliente es requerido' }),
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  dueDate: z.string().min(1, { message: 'La fecha de vencimiento es requerida' }),
  taxRate: z.coerce.number().min(0, { message: 'El IVA debe ser un número positivo' }).default(10),
  taxApplication: z.enum(['included', 'excluded'], {
    required_error: 'Debe seleccionar cómo aplicar el IVA',
  }).default('excluded'),
  notes: z.string().optional(),
});

interface BillFormProps {
  onSubmit: (values: CreateBillDto) => void;
}

export function BillForm({ onSubmit }: BillFormProps) {
  const { clients, loading: loadingClients, fetchClients } = useClients();
  const { transfers, fetchTransfers } = useTransfers();
  const { calculateBillPreview } = useBilling();
  
  const [selectedTransfers, setSelectedTransfers] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [billPreview, setBillPreview] = useState<BillPreview | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [transferFilter, setTransferFilter] = useState('');

  // Initialize with default values
  const form = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      clientId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days later
      taxRate: 10, // Default 10%
      taxApplication: 'excluded', // Default: Tax excluded (added on top)
      notes: '',
    },
  });

  // Fetch clients and transfers
  useEffect(() => {
    fetchClients();
    fetchTransfers();
  }, [fetchClients, fetchTransfers]);

  // Update selected client when clientId changes
  useEffect(() => {
    const clientId = form.watch('clientId');
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      setSelectedClient(client || null);
    } else {
      setSelectedClient(null);
    }
  }, [form.watch('clientId'), clients]);

  // Filter out already billed transfers
  const availableTransfers = transfers.filter(t => !t.billed);

  // Get transfers filtered by client name if a filter is set
  const getFilteredTransfers = () => {
    if (!transferFilter) return availableTransfers;

    const selectedClientId = form.watch('clientId');
    
    return availableTransfers.filter(transfer => {
      // If a client is selected, only show transfers for that client
      if (selectedClientId && transfer.client_id) {
        return transfer.client_id === selectedClientId;
      }
      
      // Otherwise, filter by transfer origin/destination
      const searchLower = transferFilter.toLowerCase();
      return (
        transfer.origin.toLowerCase().includes(searchLower) ||
        transfer.destination.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredTransfers = getFilteredTransfers();

  // Calculate bill preview whenever selection changes
  useEffect(() => {
    const updatePreview = async () => {
      const values = form.getValues();
      if (values.clientId && selectedTransfers.length > 0) {
        setIsCalculating(true);
        const preview = await calculateBillPreview(
          values.clientId,
          selectedTransfers,
          values.taxRate,
          values.taxApplication as TaxApplicationType
        );
        setBillPreview(preview);
        setIsCalculating(false);
      } else {
        setBillPreview(null);
      }
    };

    updatePreview();
  }, [
    selectedTransfers, 
    form.watch('clientId'), 
    form.watch('taxRate'), 
    form.watch('taxApplication'),
    calculateBillPreview
  ]);

  const handleTransferToggle = (transferId: string) => {
    setSelectedTransfers(prev => {
      if (prev.includes(transferId)) {
        return prev.filter(id => id !== transferId);
      } else {
        return [...prev, transferId];
      }
    });
  };

  const handleSelectAllTransfers = () => {
    if (selectedTransfers.length === filteredTransfers.length) {
      setSelectedTransfers([]);
    } else {
      setSelectedTransfers(filteredTransfers.map(t => t.id));
    }
  };

  const handleSubmit = (values: z.infer<typeof billSchema>) => {
    if (selectedTransfers.length === 0) {
      form.setError('root', { 
        message: 'Debe seleccionar al menos un transfer para facturar' 
      });
      return;
    }

    // Ensure all required fields are present
    const billData: CreateBillDto = {
      clientId: values.clientId,
      date: values.date,
      dueDate: values.dueDate,
      transferIds: selectedTransfers,
      taxRate: values.taxRate,
      taxApplication: values.taxApplication as TaxApplicationType,
      notes: values.notes
    };

    onSubmit(billData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Handle client selection change to filter transfers
  const handleClientChange = (clientId: string) => {
    form.setValue('clientId', clientId);
    
    // Clear the selected transfers when changing client
    setSelectedTransfers([]);
  };

  return (
    <Card className="glass-card w-full max-w-4xl mx-auto">
      <CardContent className="pt-4 px-4 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select 
                        onValueChange={(value) => handleClientChange(value)} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                    name="dueDate"
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

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="taxRate"
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
                    name="taxApplication"
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Transfers a facturar</h3>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSelectAllTransfers}
                      disabled={filteredTransfers.length === 0}
                    >
                      {selectedTransfers.length === filteredTransfers.length && filteredTransfers.length > 0 
                        ? 'Deseleccionar todos' 
                        : 'Seleccionar todos'}
                    </Button>
                  </div>
                </div>
                
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Filtrar transfers por origen o destino..."
                    value={transferFilter}
                    onChange={(e) => setTransferFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredTransfers.length === 0 ? (
                  <div className="text-center p-4 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">No hay transfers disponibles para facturar</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
                    <div className="divide-y">
                      {filteredTransfers.map((transfer) => (
                        <div key={transfer.id} className="p-3 hover:bg-accent/10">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id={`transfer-${transfer.id}`}
                              checked={selectedTransfers.includes(transfer.id)}
                              onCheckedChange={() => handleTransferToggle(transfer.id)}
                            />
                            <div className="space-y-1">
                              <Label
                                htmlFor={`transfer-${transfer.id}`}
                                className="font-medium cursor-pointer"
                              >
                                {transfer.origin} → {transfer.destination}
                              </Label>
                              <div className="text-sm text-muted-foreground">
                                <span>Fecha: {transfer.date}</span>
                                <span className="mx-2">•</span>
                                <span>Precio: {formatCurrency(transfer.price)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {billPreview && (
                  <div className="mt-4 border rounded-md p-3 space-y-2">
                    <h3 className="font-medium">Resumen de factura</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(billPreview.subTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA ({billPreview.taxRate}%):</span>
                        <span>{formatCurrency(billPreview.taxAmount)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(billPreview.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loadingClients || isCalculating || selectedTransfers.length === 0}
            >
              {isCalculating ? 'Calculando...' : 'Crear Factura'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
