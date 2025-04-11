
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bill } from '@/types/billing';
import { toast } from 'sonner';

export function useFetchBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check auth status first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('No session found, user might not be authenticated');
        setError('No se ha encontrado una sesión válida. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      const fetchWithRetry = async (retries = 3, delay = 1000) => {
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
          setError(null);
          return true;
        } catch (err: any) {
          if (retries <= 0) throw err;
          
          console.warn(`Error fetching bills, retrying (${retries} attempts left)...`, err);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(retries - 1, delay * 1.5);
        }
      }

      await fetchWithRetry();
    } catch (err: any) {
      console.error('Error fetching bills:', err);
      setError(`Error al cargar facturas: ${err.message}`);
      toast.error(`Error al cargar facturas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return { bills, loading, error, fetchBills };
}
