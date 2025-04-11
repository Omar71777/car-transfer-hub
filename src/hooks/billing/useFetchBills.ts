
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bill } from '@/types/billing';
import { toast } from 'sonner';

export function useFetchBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bills')
        .select(`
          *,
          client:client_id (
            id,
            name,
            email,
            phone,
            address,
            tax_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBills(data as unknown as Bill[]);
      setLoading(false);
    } catch (error: any) {
      toast.error(`Error al cargar facturas: ${error.message}`);
      console.error('Error fetching bills:', error);
      setLoading(false);
    }
  }, []);

  return { bills, loading, fetchBills };
}
