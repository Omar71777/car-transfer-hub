
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

interface ProfitFiltersProps {
  collaborators: string[];
  expenseTypes: string[];
  onFilterChange: (filters: {
    dateRange: { from?: Date; to?: Date };
    collaborator?: string;
    expenseType?: string;
  }) => void;
  onResetFilters: () => void;
}

export function ProfitFilters({ 
  collaborators, 
  expenseTypes, 
  onFilterChange, 
  onResetFilters 
}: ProfitFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [collaborator, setCollaborator] = useState<string>('');
  const [expenseType, setExpenseType] = useState<string>('');
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      dateRange,
      collaborator: collaborator || undefined,
      expenseType: expenseType || undefined
    });
  };

  const handleResetFilters = () => {
    setDateRange({});
    setCollaborator('');
    setExpenseType('');
    onResetFilters();
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date Range Selector */}
        <div>
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                      {format(dateRange.to, 'dd/MM/yyyy')}
                    </>
                  ) : (
                    format(dateRange.from, 'dd/MM/yyyy')
                  )
                ) : (
                  <span>Seleccionar fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range || {});
                  if (range?.to) {
                    setDatePopoverOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Collaborator Filter */}
        <div>
          <Select value={collaborator} onValueChange={setCollaborator}>
            <SelectTrigger>
              <SelectValue placeholder="Colaborador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los colaboradores</SelectItem>
              {collaborators.map((collab) => (
                <SelectItem key={collab} value={collab}>
                  {collab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Expense Type Filter */}
        <div>
          <Select value={expenseType} onValueChange={setExpenseType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de gasto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los gastos</SelectItem>
              {expenseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleApplyFilters} 
            className="flex-1"
          >
            Aplicar
          </Button>
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Resetear
          </Button>
        </div>
      </div>
    </div>
  );
}
