
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Transfer } from '@/types';

interface TransferTableFiltersProps {
  transfers: Transfer[];
  onFilterChange: (filteredTransfers: Transfer[]) => void;
}

export function TransferTableFilters({ transfers, onFilterChange }: TransferTableFiltersProps) {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [collaboratorFilter, setCollaboratorFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');

  // Extract unique collaborators and clients for filter options
  const collaborators = useMemo(() => {
    const uniqueCollaborators = new Set<string>();
    transfers.forEach(transfer => {
      if (transfer.collaborator && transfer.collaborator.trim() !== '') {
        uniqueCollaborators.add(transfer.collaborator);
      } else {
        uniqueCollaborators.add('Propio');
      }
    });
    return Array.from(uniqueCollaborators).sort();
  }, [transfers]);

  const clients = useMemo(() => {
    const uniqueClients = new Set<string>();
    transfers.forEach(transfer => {
      if (transfer.client && transfer.client.name) {
        uniqueClients.add(transfer.client.name);
      }
    });
    return Array.from(uniqueClients).sort();
  }, [transfers]);

  // Date filter options
  const dateOptions = useMemo(() => {
    const options = [
      { value: 'all', label: 'Todas las fechas' },
      { value: 'today', label: 'Hoy' },
      { value: 'thisWeek', label: 'Esta semana' },
      { value: 'thisMonth', label: 'Este mes' },
      { value: 'thisYear', label: 'Este año' },
    ];
    return options;
  }, []);

  // Apply filters
  const applyFilters = () => {
    let filteredResults = [...transfers];

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      
      // Calculate first day of current week (starting from Monday)
      const dayOfWeek = today.getDay();
      const firstDayOfWeek = new Date(today);
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday
      firstDayOfWeek.setDate(today.getDate() - diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      
      // First day of current month
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // First day of current year
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      filteredResults = filteredResults.filter(transfer => {
        const transferDate = new Date(transfer.date);
        
        switch (dateFilter) {
          case 'today':
            return transferDate >= startOfDay;
          case 'thisWeek':
            return transferDate >= firstDayOfWeek;
          case 'thisMonth':
            return transferDate >= firstDayOfMonth;
          case 'thisYear':
            return transferDate >= firstDayOfYear;
          default:
            return true;
        }
      });
    }

    // Apply collaborator filter
    if (collaboratorFilter !== 'all') {
      filteredResults = filteredResults.filter(transfer => {
        if (collaboratorFilter === 'Propio') {
          return !transfer.collaborator || transfer.collaborator.trim() === '';
        }
        return transfer.collaborator === collaboratorFilter;
      });
    }

    // Apply client filter
    if (clientFilter !== 'all') {
      filteredResults = filteredResults.filter(transfer => {
        return transfer.client && transfer.client.name === clientFilter;
      });
    }

    onFilterChange(filteredResults);
  };

  // Reset all filters
  const resetFilters = () => {
    setDateFilter('all');
    setCollaboratorFilter('all');
    setClientFilter('all');
    onFilterChange(transfers);
  };

  // Apply filters when any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [dateFilter, collaboratorFilter, clientFilter]);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por fecha" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Collaborator Filter */}
          <Select value={collaboratorFilter} onValueChange={setCollaboratorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Colaborador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los colaboradores</SelectItem>
              {collaborators.map(collab => (
                <SelectItem key={collab} value={collab}>
                  {collab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Client Filter */}
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los clientes</SelectItem>
              {clients.map(client => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Reset button */}
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
