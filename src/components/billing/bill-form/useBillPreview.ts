
import { useState, useEffect } from 'react';
import { BillPreview, TaxApplicationType } from '@/types/billing';
import { Client } from '@/types/client';
import { useBilling } from '@/hooks/useBilling';

export function useBillPreview(
  selectedTransfers: string[],
  clientId: string,
  taxRate: number,
  taxApplication: TaxApplicationType,
  selectedClient: Client | null
) {
  const { calculateBillPreview } = useBilling();
  const [billPreview, setBillPreview] = useState<BillPreview | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate bill preview whenever selection changes
  useEffect(() => {
    const updatePreview = async () => {
      if (clientId && selectedTransfers.length > 0) {
        setIsCalculating(true);
        const preview = await calculateBillPreview(
          clientId,
          selectedTransfers,
          taxRate,
          taxApplication
        );
        setBillPreview(preview);
        setIsCalculating(false);
      } else {
        setBillPreview(null);
      }
    };

    updatePreview();
  }, [selectedTransfers, clientId, taxRate, taxApplication, calculateBillPreview]);

  return {
    billPreview,
    isCalculating
  };
}
