
import { useTransfers } from '@/hooks/useTransfers';
import { useExpenses } from '@/hooks/useExpenses';
import { useClients } from '@/hooks/useClients';

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
      const date = new Date(transfer.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const monthName = date.toLocaleString('es-ES', { month: 'short' });
      
      if (!months[monthYear]) {
        months[monthYear] = {
          name: monthName,
          ingresos: 0,
          gastos: 0,
          comisiones: 0,
          beneficio: 0
        };
      }
      
      months[monthYear].ingresos += transfer.price;
      const commission = (transfer.price * transfer.commission) / 100;
      months[monthYear].comisiones += commission;
    });
    
    // Process expenses
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      
      if (months[monthYear]) {
        months[monthYear].gastos += expense.amount;
      }
    });
    
    // Calculate profit
    Object.values(months).forEach(month => {
      month.beneficio = month.ingresos - (month.gastos + month.comisiones);
    });
    
    return Object.values(months);
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
    
    return Object.entries(collaborators).map(([name, value]) => ({ name, value }));
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
