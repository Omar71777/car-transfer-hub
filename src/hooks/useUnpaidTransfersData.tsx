
import { useState, useEffect } from 'react';
import { Transfer } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function useUnpaidTransfersData(transfers: Transfer[], selectedCollaborator: string) {
  const [unpaidTransfers, setUnpaidTransfers] = useState<Transfer[]>([]);
  
  // Filter transfers for unpaid ones
  useEffect(() => {
    console.log('Filtering unpaid transfers from', transfers.length, 'total transfers');
    
    // Log all unique payment statuses to help with debugging
    const uniqueStatuses = [...new Set(transfers.map(t => t.paymentStatus))];
    console.log('Available payment statuses:', uniqueStatuses);
    
    const filtered = transfers.filter(t => t.paymentStatus === 'pending');
    console.log('Filtered pending transfers:', filtered.length);
    
    if (selectedCollaborator === 'all') {
      setUnpaidTransfers(filtered);
    } else {
      // Case-insensitive comparison for collaborator filtering
      const collaboratorFiltered = filtered.filter(t => 
        t.collaborator && t.collaborator.toLowerCase() === selectedCollaborator.toLowerCase()
      );
      console.log('Filtered by collaborator:', collaboratorFiltered.length);
      setUnpaidTransfers(collaboratorFiltered);
    }
  }, [transfers, selectedCollaborator]);
  
  // Get unique collaborators from unpaid transfers with normalized names
  const getUnpaidCollaborators = () => {
    // Create a map to store unique collaborator names with original casing
    const collaboratorMap = new Map<string, string>();
    
    transfers
      .filter(t => t.paymentStatus === 'pending' && t.collaborator)
      .forEach(t => {
        if (!t.collaborator) return;
        const normalizedName = t.collaborator.toLowerCase();
        if (!collaboratorMap.has(normalizedName)) {
          collaboratorMap.set(normalizedName, t.collaborator);
        }
      });
    
    // Convert the map values to an array
    return Array.from(collaboratorMap.values());
  };
  
  // Calculate total unpaid amount for a collaborator
  const calculateUnpaidTotal = (collaboratorName: string) => {
    return transfers
      .filter(t => 
        t.paymentStatus === 'pending' && 
        t.collaborator && 
        t.collaborator.toLowerCase() === collaboratorName.toLowerCase()
      )
      .reduce((sum, t) => {
        // Consider commission type when calculating
        const commissionAmount = t.commissionType === 'percentage' 
          ? (t.price * t.commission / 100)
          : t.commission;
        return sum + (t.price - commissionAmount);
      }, 0);
  };
  
  // Group unpaid transfers by month for each collaborator
  const getMonthlyUnpaidData = () => {
    // Get normalized unique collaborator names with original casing preserved
    const collaboratorNames = getUnpaidCollaborators();
    console.log('Unpaid collaborators found:', collaboratorNames);
    
    const monthlyData: {
      collaborator: string;
      month: string;
      transferCount: number;
      total: number;
      transfers: Transfer[];
    }[] = [];
    
    collaboratorNames.forEach(name => {
      if (!name) return;
      
      // Case-insensitive filtering for collaborator transfers
      const collaboratorTransfers = transfers.filter(
        t => t.paymentStatus === 'pending' && 
             t.collaborator && 
             t.collaborator.toLowerCase() === name.toLowerCase()
      );
      
      // Group by month - using Spanish locale
      const monthGroups: Record<string, Transfer[]> = {};
      
      collaboratorTransfers.forEach(transfer => {
        try {
          const date = new Date(transfer.date);
          const monthYear = format(date, 'MMMM yyyy', { locale: es });
          
          if (!monthGroups[monthYear]) {
            monthGroups[monthYear] = [];
          }
          
          monthGroups[monthYear].push(transfer);
        } catch (error) {
          console.error('Error parsing date:', transfer.date);
        }
      });
      
      // Calculate total for each month
      Object.entries(monthGroups).forEach(([month, monthTransfers]) => {
        const total = monthTransfers.reduce((sum, t) => {
          // Consider commission type when calculating
          const commissionAmount = t.commissionType === 'percentage' 
            ? (t.price * t.commission / 100)
            : t.commission;
          return sum + (t.price - commissionAmount);
        }, 0);
        
        monthlyData.push({
          collaborator: name,
          month,
          transferCount: monthTransfers.length,
          total,
          transfers: monthTransfers
        });
      });
    });
    
    console.log('Generated monthly data:', monthlyData.length, 'entries');
    return monthlyData;
  };
  
  return {
    unpaidTransfers,
    getUnpaidCollaborators,
    calculateUnpaidTotal,
    getMonthlyUnpaidData
  };
}
