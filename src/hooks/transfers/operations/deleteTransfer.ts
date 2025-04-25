
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simplified delete function that doesn't call fetchTransfers after deletion
export async function deleteTransfer(user: any, id: string) {
  if (!user) return false;
  
  try {
    // First delete related extra charges
    const { error: extraChargesError } = await supabase
      .from('extra_charges')
      .delete()
      .eq('transfer_id', id);
    
    if (extraChargesError) {
      console.error('Error deleting extra charges:', extraChargesError);
      throw extraChargesError;
    }
    
    // Then delete related expenses
    const { error: expensesError } = await supabase
      .from('expenses')
      .delete()
      .eq('transfer_id', id);
    
    if (expensesError) {
      console.error('Error deleting expenses:', expensesError);
      throw expensesError;
    }
    
    // Finally delete the transfer itself
    const { error: transferError } = await supabase
      .from('transfers')
      .delete()
      .eq('id', id);
    
    if (transferError) {
      console.error('Error deleting transfer:', transferError);
      throw transferError;
    }
    
    toast.success('Transfer eliminado exitosamente');
    return true;
  } catch (error: any) {
    console.error('Error deleting transfer:', error);
    toast.error(`Error al eliminar el transfer: ${error.message}`);
    return false;
  }
}
