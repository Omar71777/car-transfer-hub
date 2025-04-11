
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Inserts bill items into the database
 */
export async function saveBillItems(billItems: any[]) {
  if (billItems.length === 0) {
    console.error('No valid bill items to insert');
    throw new Error('No se pudieron crear elementos de factura');
  }
  
  console.log(`Inserting ${billItems.length} bill items`);
  
  try {
    const { data: insertedItems, error: itemsError } = await supabase
      .from('bill_items')
      .insert(billItems)
      .select();

    if (itemsError) {
      console.error('Error inserting bill items:', itemsError);
      // Don't throw here - we want to return the bill ID even if items fail
      toast.error('La factura se creó, pero hubo un problema con los elementos');
      return false;
    } else {
      console.log(`Successfully inserted ${insertedItems?.length || 0} bill items`);
      return true;
    }
  } catch (itemInsertError) {
    console.error('Exception inserting bill items:', itemInsertError);
    // Don't throw here - return the bill ID even if items fail
    toast.error('La factura se creó, pero hubo un problema con los elementos');
    return false;
  }
}
