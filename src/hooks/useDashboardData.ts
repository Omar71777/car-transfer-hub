
import { useState, useEffect } from 'react';
import { Transfer, Expense, Shift, Driver } from '@/types';
import { format, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

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
    const loadDashboardData = () => {
      setLoading(true);
      
      // Load transfers
      const storedTransfers = localStorage.getItem('transfers');
      const transfers = storedTransfers ? JSON.parse(storedTransfers) : [];
      
      // Load expenses
      const storedExpenses = localStorage.getItem('expenses');
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      
      // Load shifts
      const storedShifts = localStorage.getItem('shifts');
      const shifts = storedShifts ? JSON.parse(storedShifts) : [];
      
      // Load drivers
      const storedDrivers = localStorage.getItem('drivers');
      const drivers = storedDrivers ? JSON.parse(storedDrivers) : [];
      
      // Calculate stats
      const totalTransfers = transfers.length;
      const totalIncome = transfers.reduce((sum: number, transfer: Transfer) => 
        sum + (transfer.price || 0), 0);
      
      // Calcular las comisiones totales
      const totalCommissions = transfers.reduce((sum: number, transfer: Transfer) => 
        sum + ((transfer.price * transfer.commission) / 100 || 0), 0);
      
      // Sumar los gastos regulares y las comisiones
      const expensesTotal = expenses.reduce((sum: number, expense: Expense) => 
        sum + (expense.amount || 0), 0);
      const totalExpenses = expensesTotal + totalCommissions;
      
      // Calcular el ingreso neto después de gastos y comisiones
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
      
      setUpcomingShifts(upcoming.slice(0, 3));
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  return {
    stats,
    upcomingShifts,
    loading
  };
}
