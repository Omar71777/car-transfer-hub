
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transfer } from '@/types';

interface TransferTableFiltersProps {
  transfers: Transfer[];
  onFilterChange: (filteredTransfers: Transfer[]) => void;
}

export function TransferTableFilters({ transfers, onFilterChange }: TransferTableFiltersProps) {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [collaboratorFilter, setCollaboratorFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  
  // Extract unique values for filter dropdowns
  const uniqueCollaborators = [...new Set(transfers.map(t => t.collaborator || "Propio"))];
  const uniqueClients = [...new Set(transfers.map(t => t.client?.name).filter(Boolean))];
  
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
          return !transfer.collaborator;
        }
        return transfer.collaborator === collaboratorFilter;
      });
    }
    
    // Client filter
    if (clientFilter !== 'all') {
      filtered = filtered.filter(transfer => transfer.client?.name === clientFilter);
    }
    
    // Payment status filter
    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(transfer => transfer.paymentStatus === paymentStatusFilter);
    }
    
    onFilterChange(filtered);
  }, [dateFilter, collaboratorFilter, clientFilter, paymentStatusFilter, transfers]);
  
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
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
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
                <SelectItem key={collaborator || 'no-collaborator'} value={collaborator}>
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
                <SelectItem key={client || 'no-client'} value={client || 'no-client'}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <Label htmlFor="payment-status-filter">Estado de pago</Label>
          <Select 
            value={paymentStatusFilter} 
            onValueChange={setPaymentStatusFilter}
          >
            <SelectTrigger id="payment-status-filter">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="paid">Cobrados</SelectItem>
              <SelectItem value="pending">Pendientes de pago</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
