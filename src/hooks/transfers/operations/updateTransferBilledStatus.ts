
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function updateTransferBilledStatus(user: any, transferIds: string[], billed: boolean) {
  if (!user || !transferIds.length) return false;
  
  try {
    const { error } = await supabase
      .from('transfers')
      .update({ billed })
      .in('id', transferIds);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error updating transfer billed status:', error);
    toast.error(`Error al actualizar el estado de facturación: ${error.message}`);
    return false;
  }
}
