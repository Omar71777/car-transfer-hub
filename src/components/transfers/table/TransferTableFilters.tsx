
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transfer } from '@/types';
import { format } from 'date-fns';

interface TransferTableFiltersProps {
  transfers: Transfer[];
  onFilterChange: (filteredTransfers: Transfer[]) => void;
}

export function TransferTableFilters({ transfers, onFilterChange }: TransferTableFiltersProps) {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [collaboratorFilter, setCollaboratorFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract unique values for filter dropdowns
  const uniqueCollaborators = [...new Set(transfers.map(t => t.collaborator_name || "Propio"))];
  const uniqueClients = [...new Set(transfers.map(t => t.client_name))];
  
  // Current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Compute available date filters
  const dateFilters = [
    { value: 'all', label: 'Todas las fechas' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'year', label: 'Este año' },
  ];
  
  // Apply filters
  useEffect(() => {
    let filtered = [...transfers];
    
    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      
      filtered = filtered.filter(transfer => {
        const transferDate = new Date(transfer.date);
        transferDate.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case 'today':
            return transferDate.getTime() === today.getTime();
          case 'week':
            return transferDate >= startOfWeek;
          case 'month':
            return transferDate >= startOfMonth;
          case 'year':
            return transferDate >= startOfYear;
          default:
            return true;
        }
      });
    }
    
    // Collaborator filter
    if (collaboratorFilter !== 'all') {
      filtered = filtered.filter(transfer => {
        if (collaboratorFilter === 'Propio') {
          return !transfer.collaborator_name;
        }
        return transfer.collaborator_name === collaboratorFilter;
      });
    }
    
    // Client filter
    if (clientFilter !== 'all') {
      filtered = filtered.filter(transfer => transfer.client_name === clientFilter);
    }
    
    // Search term (for location search)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(transfer => 
        transfer.pickup_location.toLowerCase().includes(term) || 
        transfer.dropoff_location.toLowerCase().includes(term)
      );
    }
    
    onFilterChange(filtered);
  }, [dateFilter, collaboratorFilter, clientFilter, searchTerm, transfers]);
  
  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-1/4">
          <Label htmlFor="date-filter">Filtrar por fecha</Label>
          <Select 
            value={dateFilter} 
            onValueChange={setDateFilter}
          >
            <SelectTrigger id="date-filter">
              <SelectValue placeholder="Todas las fechas" />
            </SelectTrigger>
            <SelectContent>
              {dateFilters.map(filter => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <Label htmlFor="collaborator-filter">Filtrar por colaborador</Label>
          <Select 
            value={collaboratorFilter} 
            onValueChange={setCollaboratorFilter}
          >
            <SelectTrigger id="collaborator-filter">
              <SelectValue placeholder="Todos los colaboradores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los colaboradores</SelectItem>
              {uniqueCollaborators.map(collaborator => (
                <SelectItem key={collaborator} value={collaborator}>
                  {collaborator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <Label htmlFor="client-filter">Filtrar por cliente</Label>
          <Select 
            value={clientFilter} 
            onValueChange={setClientFilter}
          >
            <SelectTrigger id="client-filter">
              <SelectValue placeholder="Todos los clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los clientes</SelectItem>
              {uniqueClients.map(client => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <Label htmlFor="search">Buscar por ubicación</Label>
          <Input
            id="search"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
