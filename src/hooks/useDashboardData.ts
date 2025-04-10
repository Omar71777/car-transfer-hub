
import { useState, useEffect } from 'react';
import { Transfer, Expense, Shift, Driver } from '@/types';
import { format, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  totalTransfers: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  upcomingShifts: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTransfers: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    upcomingShifts: 0
  });
  const [upcomingShifts, setUpcomingShifts] = useState<Array<Shift & { driverName: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        // Load transfers from Supabase
        const { data: transfers, error: transfersError } = await supabase
          .from('transfers')
          .select('id, price, commission')
          .order('date', { ascending: false });
          
        if (transfersError) throw transfersError;
        
        // Load expenses from Supabase
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .order('date', { ascending: false });
          
        if (expensesError) throw expensesError;
        
        // Load shifts from localStorage (will be migrated to Supabase later)
        const storedShifts = localStorage.getItem('shifts');
        const shifts = storedShifts ? JSON.parse(storedShifts) : [];
        
        // Load drivers from localStorage (will be migrated to Supabase later)
        const storedDrivers = localStorage.getItem('drivers');
        const drivers = storedDrivers ? JSON.parse(storedDrivers) : [];
        
        // Calculate stats
        const totalTransfers = transfers.length;
        const totalIncome = transfers.reduce((sum: number, transfer: Transfer) => 
          sum + (Number(transfer.price) || 0), 0);
        
        // Calculate total commissions
        const totalCommissions = transfers.reduce((sum: number, transfer: Transfer) => 
          sum + ((Number(transfer.price) * Number(transfer.commission)) / 100 || 0), 0);
        
        // Add regular expenses and commissions
        const expensesTotal = expenses.reduce((sum: number, expense: Expense) => 
          sum + (Number(expense.amount) || 0), 0);
        const totalExpenses = expensesTotal + totalCommissions;
        
        // Calculate net income after expenses and commissions
        const netIncome = totalIncome - totalExpenses;
        
        // Get upcoming shifts (next 7 days)
        const today = new Date();
        const nextWeek = addDays(today, 7);
        
        const upcoming = shifts
          .filter((shift: Shift) => {
            const shiftDate = new Date(shift.date);
            return isWithinInterval(shiftDate, {
              start: startOfDay(today),
              end: endOfDay(nextWeek)
            });
          })
          .map((shift: Shift) => {
            const driver = drivers.find((d: Driver) => d.id === shift.driverId);
            return {
              ...shift,
              driverName: driver ? driver.name : 'Conductor no asignado'
            };
          })
          .sort((a: Shift, b: Shift) => 
            new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setStats({
          totalTransfers,
          totalIncome,
          totalExpenses,
          netIncome,
          upcomingShifts: upcoming.length
        });
        
        // Take up to 3 shifts but ensure we get the most immediate ones
        setUpcomingShifts(upcoming.slice(0, 3));
      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast.error(`Error al cargar los datos del dashboard: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return {
    stats,
    upcomingShifts,
    loading
  };
}
