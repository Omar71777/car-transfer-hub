
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Printer, FileDown, FileText } from 'lucide-react';
import { downloadCSV, printProfitReport, prepareProfitDataForExport } from '@/lib/exports';
import { Transfer, Expense } from '@/types';
import { format } from 'date-fns';

interface ExportOptionsProps {
  transfers: Transfer[];
  expenses: Expense[];
  stats: {
    totalIncome: number;
    totalExpenses: number;
    totalCommissions: number;
    netProfit: number;
    profitMargin: number;
  };
}

export function ExportOptions({ transfers, expenses, stats }: ExportOptionsProps) {
  const handleExportCSV = () => {
    const { dailyData, summaryData } = prepareProfitDataForExport(transfers, expenses, stats);
    
    // Export daily data
    downloadCSV(
      dailyData, 
      `ganancias-diarias-${format(new Date(), 'yyyy-MM-dd')}.csv`
    );
    
    // Export summary in a separate file
    downloadCSV(
      summaryData, 
      `resumen-ganancias-${format(new Date(), 'yyyy-MM-dd')}.csv`
    );
  };
  
  const handlePrintReport = () => {
    printProfitReport(
      `Informe de Ganancias - ${format(new Date(), 'dd/MM/yyyy')}`,
      transfers,
      expenses,
      stats
    );
  };
  
  return (
    <div className="flex justify-end mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Exportar Informe
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>Exportar CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrintReport} className="cursor-pointer">
            <Printer className="mr-2 h-4 w-4" />
            <span>Imprimir Informe</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
