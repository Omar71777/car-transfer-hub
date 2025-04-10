
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function deleteTransfer(user: any, id: string) {
  if (!user) return false;
  
  try {
    // Delete expenses first (if any)
    const { error: expensesError } = await supabase
      .from('expenses')
      .delete()
      .eq('transfer_id', id);

    if (expensesError) {
      throw expensesError;
    }

    // Delete extra charges (if any)
    const { error: extraChargesError } = await supabase
      .from('extra_charges')
      .delete()
      .eq('transfer_id', id);

    if (extraChargesError) {
      throw extraChargesError;
    }

    // Finally delete the transfer
    const { error } = await supabase
      .from('transfers')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error('Error deleting transfer:', error);
    toast.error(`Error al eliminar el transfer: ${error.message}`);
    return false;
  }
}
