
import { useState, useEffect } from 'react';
import { Transfer } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function useUnpaidTransfersData(transfers: Transfer[], selectedCollaborator: string) {
  const [unpaidTransfers, setUnpaidTransfers] = useState<Transfer[]>([]);
  
  // Filter transfers for unpaid ones
  useEffect(() => {
    const filtered = transfers.filter(t => t.paymentStatus === 'pending');
    
    if (selectedCollaborator === 'all') {
      setUnpaidTransfers(filtered);
    } else {
      setUnpaidTransfers(filtered.filter(t => t.collaborator === selectedCollaborator));
    }
  }, [transfers, selectedCollaborator]);
  
  // Get unique collaborators from unpaid transfers
  const getUnpaidCollaborators = () => {
    const collaboratorNames = Array.from(
      new Set(transfers.filter(t => t.paymentStatus === 'pending').map(t => t.collaborator))
    ).filter(Boolean) as string[];
    
    return collaboratorNames;
  };
  
  // Calculate total unpaid amount for a collaborator
  const calculateUnpaidTotal = (collaboratorName: string) => {
    return transfers
      .filter(t => t.paymentStatus === 'pending' && t.collaborator === collaboratorName)
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
    const collaboratorNames = getUnpaidCollaborators();
    const monthlyData: {
      collaborator: string;
      month: string;
      transferCount: number;
      total: number;
      transfers: Transfer[];
    }[] = [];
    
    collaboratorNames.forEach(name => {
      if (!name) return;
      
      const collaboratorTransfers = transfers.filter(
        t => t.paymentStatus === 'pending' && t.collaborator === name
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
    
    return monthlyData;
  };
  
  return {
    unpaidTransfers,
    getUnpaidCollaborators,
    calculateUnpaidTotal,
    getMonthlyUnpaidData
  };
}
