
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useClients } from '@/hooks/useClients';
import { parseISO, format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo, useEffect, useState } from 'react';

export interface MonthlyData {
  name: string;
  ingresos: number;
  gastos: number;
  comisiones: number;
  beneficio: number;
}

export interface CollaboratorData {
  name: string;
  value: number;
}

export interface ClientData {
  name: string;
  value: number;
  count: number;
}

export function useAnalyticsData() {
  const { transfers, loading: transfersLoading, fetchTransfers } = useTransfers();
  const { expenses, loading: expensesLoading, fetchExpenses } = useExpenses();
  const { clients, loading: clientsLoading, fetchClients } = useClients();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Ensure data is loaded initially
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTransfers(),
          fetchExpenses(),
          fetchClients()
        ]);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadData();
  }, [fetchTransfers, fetchExpenses, fetchClients]);
  
  // Generate monthly data
  const monthlyData = useMemo(() => {
    const months: Record<string, MonthlyData> = {};
    
    // Process transfers
    transfers.forEach(transfer => {
      try {
        // Make sure we have a valid date
        let date;
        try {
          date = parseISO(transfer.date);
          if (!isValid(date)) {
            console.warn(`Invalid date format in transfer: ${transfer.date}`);
            return;
          }
        } catch (error) {
          console.warn(`Error parsing date: ${transfer.date}`, error);
          return;
        }
        
        const monthYear = format(date, 'yyyy-MM', { locale: es });
        const monthName = format(date, 'MMMM', { locale: es });
        // Capitalize first letter of month name
        const monthNameCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        
        if (!months[monthYear]) {
          months[monthYear] = {
            name: monthNameCapitalized,
            ingresos: 0,
            gastos: 0,
            comisiones: 0,
            beneficio: 0
          };
        }
        
        // Add to income
        const price = Number(transfer.price) || 0;
        months[monthYear].ingresos += price;
        
        // Calculate commission
        const commission = transfer.commission ? 
          (price * Number(transfer.commission)) / 100 : 0;
        months[monthYear].comisiones += commission;
      } catch (error) {
        console.error('Error processing transfer date:', error);
      }
    });
    
    // Process expenses
    expenses.forEach(expense => {
      try {
        let date;
        try {
          date = parseISO(expense.date);
          if (!isValid(date)) {
            console.warn(`Invalid date format in expense: ${expense.date}`);
            return;
          }
        } catch (error) {
          console.warn(`Error parsing date: ${expense.date}`, error);
          return;
        }
        
        const monthYear = format(date, 'yyyy-MM', { locale: es });
        
        if (months[monthYear]) {
          months[monthYear].gastos += Number(expense.amount) || 0;
        }
      } catch (error) {
        console.error('Error processing expense date:', error);
      }
    });
    
    // Calculate profit
    Object.values(months).forEach(month => {
      month.beneficio = month.ingresos - (month.gastos + month.comisiones);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.entries(months)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([_, data]) => data);
  }, [transfers, expenses]);
  
  // Generate data for collaborator distribution
  const collaboratorData = useMemo(() => {
    const collaborators: Record<string, number> = {};
    
    // Filter transfers with collaborators
    const transfersWithCollaborators = transfers.filter(transfer => 
      transfer.collaborator && transfer.collaborator.trim() !== ''
    );
    
    transfersWithCollaborators.forEach(transfer => {
      const collaborator = transfer.collaborator || 'Sin colaborador';
      if (!collaborators[collaborator]) {
        collaborators[collaborator] = 0;
      }
      collaborators[collaborator] += Number(transfer.price) || 0;
    });
    
    return Object.entries(collaborators)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transfers]);
  
  // Generate data for client distribution
  const clientData = useMemo(() => {
    const clientsData: Record<string, { value: number, count: number }> = {};
    
    transfers.forEach(transfer => {
      if (transfer.clientId) {
        // Find client name
        const client = clients.find(c => c.id === transfer.clientId);
        const clientName = client ? client.name : 'Cliente desconocido';
        
        if (!clientsData[clientName]) {
          clientsData[clientName] = { value: 0, count: 0 };
        }
        
        clientsData[clientName].value += Number(transfer.price) || 0;
        clientsData[clientName].count += 1;
      }
    });
    
    return Object.entries(clientsData)
      .map(([name, data]) => ({ 
        name, 
        value: data.value,
        count: data.count 
      }))
      .sort((a, b) => b.value - a.value);
  }, [transfers, clients]);
  
  // Get destinations distribution
  const destinationsData = useMemo(() => {
    const destinations: Record<string, number> = {};
    
    transfers.forEach(transfer => {
      if (!transfer.destination) return;
      
      const destination = transfer.destination;
      
      if (!destinations[destination]) {
        destinations[destination] = 0;
      }
      
      destinations[destination] += 1;
    });
    
    return Object.entries(destinations)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transfers]);
  
  return {
    transfers,
    expenses,
    clients,
    monthlyData,
    collaboratorData,
    clientData,
    destinationsData,
    loading: transfersLoading || expensesLoading || clientsLoading || isInitialLoad
  };
}
