
import { useState, useEffect } from 'react';
import { Transfer } from '@/types';

export function useTransferFiltering(
  transfers: Transfer[],
  clientId: string | null
) {
  const [transferFilter, setTransferFilter] = useState('');
  const [selectedTransfers, setSelectedTransfers] = useState<string[]>([]);

  // Filter out already billed transfers
  const availableTransfers = transfers.filter(t => !t.billed);

  // Get transfers filtered by client and/or search text
  const getFilteredTransfers = () => {
    if (!transferFilter && !clientId) return availableTransfers;

    return availableTransfers.filter(transfer => {
      // If a client is selected, only show transfers for that client
      if (clientId && transfer.clientId) {
        const matchesClient = transfer.clientId === clientId;
        if (!transferFilter) return matchesClient;
        
        // If we have both client filter and text filter
        const searchLower = transferFilter.toLowerCase();
        return matchesClient && (
          transfer.origin.toLowerCase().includes(searchLower) ||
          transfer.destination.toLowerCase().includes(searchLower)
        );
      }
      
      // Just text filter
      if (transferFilter) {
        const searchLower = transferFilter.toLowerCase();
        return (
          transfer.origin.toLowerCase().includes(searchLower) ||
          transfer.destination.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  const filteredTransfers = getFilteredTransfers();

  // Reset selected transfers when client changes
  useEffect(() => {
    setSelectedTransfers([]);
  }, [clientId]);

  const handleTransferToggle = (transferId: string) => {
    setSelectedTransfers(prev => {
      if (prev.includes(transferId)) {
        return prev.filter(id => id !== transferId);
      } else {
        return [...prev, transferId];
      }
    });
  };

  const handleSelectAllTransfers = () => {
    if (selectedTransfers.length === filteredTransfers.length) {
      setSelectedTransfers([]);
    } else {
      setSelectedTransfers(filteredTransfers.map(t => t.id));
    }
  };

  return {
    transferFilter,
    setTransferFilter,
    selectedTransfers,
    setSelectedTransfers,
    filteredTransfers,
    handleTransferToggle,
    handleSelectAllTransfers,
  };
}
