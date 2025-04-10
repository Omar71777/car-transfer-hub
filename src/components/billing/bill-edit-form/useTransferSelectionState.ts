
import { useState, useEffect } from 'react';
import { Bill } from '@/types/billing';
import { Transfer } from '@/types';

export function useTransferSelectionState(transfers: Transfer[], bill: Bill) {
  const [transfersToAdd, setTransfersToAdd] = useState<string[]>([]);
  const [transfersToRemove, setTransfersToRemove] = useState<string[]>([]);
  
  // Get available (unbilled) transfers
  const [availableTransfers, setAvailableTransfers] = useState<Transfer[]>([]);
  // Current transfers in the bill
  const [currentTransfers, setCurrentTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    // Filter out already billed transfers except those belonging to this bill
    const availableT = transfers.filter(t => !t.billed || bill.items?.some(item => item.transfer_id === t.id));
    setAvailableTransfers(availableT);
    
    // Get current transfers in this bill
    if (bill.items) {
      const currentT = transfers.filter(t => bill.items?.some(item => item.transfer_id === t.id));
      setCurrentTransfers(currentT);
    }
  }, [transfers, bill]);

  const toggleTransferToAdd = (transferId: string) => {
    setTransfersToAdd(prev => {
      if (prev.includes(transferId)) {
        return prev.filter(id => id !== transferId);
      } else {
        return [...prev, transferId];
      }
    });
  };

  const toggleTransferToRemove = (transferId: string) => {
    setTransfersToRemove(prev => {
      if (prev.includes(transferId)) {
        return prev.filter(id => id !== transferId);
      } else {
        return [...prev, transferId];
      }
    });
  };

  // Get transfers that can be added (aren't in the bill yet and aren't marked to remove)
  const getAddableTransfers = () => {
    return availableTransfers.filter(t => 
      !currentTransfers.some(ct => ct.id === t.id) && 
      !transfersToAdd.includes(t.id)
    );
  };

  return {
    transfersToAdd,
    transfersToRemove,
    availableTransfers,
    currentTransfers,
    toggleTransferToAdd,
    toggleTransferToRemove,
    getAddableTransfers
  };
}
