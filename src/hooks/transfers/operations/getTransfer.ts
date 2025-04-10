
import { supabase } from '@/integrations/supabase/client';

export async function getTransfer(id: string) {
  try {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching transfer:', error);
    return null;
  }
}
