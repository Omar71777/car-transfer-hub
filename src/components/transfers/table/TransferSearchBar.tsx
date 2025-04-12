
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Transfer } from '@/types';

interface TransferSearchBarProps {
  transfers: Transfer[];
  onSearchResults: (results: Transfer[]) => void;
}

export function TransferSearchBar({ transfers, onSearchResults }: TransferSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      onSearchResults(transfers);
      return;
    }
    
    const results = transfers.filter(transfer => 
      // Search by client name
      (transfer.client?.name && transfer.client.name.toLowerCase().includes(term)) ||
      // Search by origin
      transfer.origin.toLowerCase().includes(term) ||
      // Search by destination
      (transfer.destination && transfer.destination.toLowerCase().includes(term))
    );
    
    onSearchResults(results);
  };

  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Buscar por cliente, origen o destino..."
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
}
