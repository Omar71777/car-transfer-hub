
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useClients } from '@/hooks/useClients';
import { parseISO, format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const { transfers, loading: transfersLoading } = useTransfers();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { clients, loading: clientsLoading } = useClients();
  
  // Generate monthly data
  const generateMonthlyData = (): MonthlyData[] => {
    const months: Record<string, MonthlyData> = {};
    
    // Process transfers
    transfers.forEach(transfer => {
      try {
        const date = parseISO(transfer.date);
        if (!isValid(date)) {
          console.warn(`Invalid date format in transfer: ${transfer.date}`);
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
        
        months[monthYear].ingresos += transfer.price;
        const commission = (transfer.price * transfer.commission) / 100;
        months[monthYear].comisiones += commission;
      } catch (error) {
        console.error('Error processing transfer date:', error);
      }
    });
    
    // Process expenses
    expenses.forEach(expense => {
      try {
        const date = parseISO(expense.date);
        if (!isValid(date)) {
          console.warn(`Invalid date format in expense: ${expense.date}`);
          return;
        }
        
        const monthYear = format(date, 'yyyy-MM', { locale: es });
        
        if (months[monthYear]) {
          months[monthYear].gastos += expense.amount;
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
  };
  
  // Generate data for collaborator distribution
  const generateCollaboratorData = (): CollaboratorData[] => {
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
      collaborators[collaborator] += transfer.price;
    });
    
    return Object.entries(collaborators)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  // Generate data for client distribution
  const generateClientData = (): ClientData[] => {
    const clientsData: Record<string, { value: number, count: number }> = {};
    
    transfers.forEach(transfer => {
      if (transfer.clientId) {
        const clientName = transfer.client?.name || 'Cliente sin nombre';
        
        if (!clientsData[clientName]) {
          clientsData[clientName] = { value: 0, count: 0 };
        }
        
        clientsData[clientName].value += transfer.price;
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
  };
  
  // Get destinations distribution
  const generateDestinationsData = () => {
    const destinations: Record<string, number> = {};
    
    transfers.forEach(transfer => {
      const destination = transfer.destination;
      
      if (!destinations[destination]) {
        destinations[destination] = 0;
      }
      
      destinations[destination] += 1;
    });
    
    return Object.entries(destinations)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  return {
    transfers,
    expenses,
    clients,
    monthlyData: generateMonthlyData(),
    collaboratorData: generateCollaboratorData(),
    clientData: generateClientData(),
    destinationsData: generateDestinationsData(),
    loading: transfersLoading || expensesLoading || clientsLoading
  };
}
