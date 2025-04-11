
import { useState, useEffect } from 'react';
import { Transfer } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// This hook is now deprecated and will be removed in a future update
// It's kept for now to prevent breaking changes, but its functionality is disabled
export function useUnpaidTransfersData(transfers: Transfer[], selectedCollaborator: string) {
  const [unpaidTransfers, setUnpaidTransfers] = useState<Transfer[]>([]);
  
  // Filter transfers for unpaid ones
  useEffect(() => {
    console.log('This functionality has been deprecated');
    setUnpaidTransfers([]);
  }, [transfers, selectedCollaborator]);
  
  // Return empty data as this feature is deprecated
  return {
    unpaidTransfers: [],
    getUnpaidCollaborators: () => [],
    calculateUnpaidTotal: () => 0,
    getMonthlyUnpaidData: () => []
  };
}
