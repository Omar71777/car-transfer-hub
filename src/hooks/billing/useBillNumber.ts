
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useBillNumber() {
  const generateBillNumber = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('bills')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      
      const year = new Date().getFullYear();
      const number = (count || 0) + 1;
      
      return `FACTURA-${year}-${number.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating bill number:', error);
      return `FACTURA-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    }
  }, []);

  return { generateBillNumber };
}
