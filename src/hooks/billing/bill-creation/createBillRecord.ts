
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BillPreview } from '@/types/billing';

/**
 * Creates the main bill record in the database
 */
export async function createBillRecord(
  clientId: string,
  billNumber: string,
  date: string,
  dueDate: string,
  preview: BillPreview,
  taxRate: number,
  taxApplication: 'included' | 'excluded',
  notes?: string
) {
  console.log('Creating bill record with:', {
    clientId,
    billNumber,
    date,
    dueDate,
    previewSummary: {
      subTotal: preview.subTotal,
      taxAmount: preview.taxAmount,
      total: preview.total
    }
  });

  const { data: bill, error: billError } = await supabase
    .from('bills')
    .insert([{
      client_id: clientId,
      number: billNumber,
      date: date,
      due_date: dueDate,
      sub_total: preview.subTotal,
      tax_rate: taxRate,
      tax_amount: preview.taxAmount,
      tax_application: taxApplication,
      total: preview.total,
      notes: notes,
      status: 'draft',
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (billError) {
    console.error('Error creating bill:', billError);
    throw billError;
  }
  
  if (!bill) {
    throw new Error('Failed to create bill record');
  }
  
  console.log('Bill record created:', bill);
  
  return bill;
}
