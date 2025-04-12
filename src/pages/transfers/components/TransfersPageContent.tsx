
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransferManagementTab } from './TransferManagementTab';
import { TransferReportsTab } from './TransferReportsTab';

interface TransfersPageContentProps {
  transfers: any[];
  expenses: any[];
  loading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onEdit: (transfer: any) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onExportCSV: () => void;
  onPrint: () => void;
}

export function TransfersPageContent({
  transfers,
  expenses,
  loading,
  activeTab,
  onTabChange,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onDeleteMultiple,
  onExportCSV,
  onPrint
}: TransfersPageContentProps) {
  return (
    <div className="py-4 md:py-6 w-full">
      <Tabs defaultValue="manage" value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full sm:w-auto mb-4">
          <TabsTrigger value="manage" className="flex-1 sm:flex-initial">Gestión de Transfers</TabsTrigger>
          <TabsTrigger value="report" className="flex-1 sm:flex-initial">Informes y Análisis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="w-full">
          <TransferManagementTab 
            transfers={transfers}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddExpense={onAddExpense}
            onViewSummary={onViewSummary}
            onDeleteMultiple={onDeleteMultiple}
          />
        </TabsContent>
        
        <TabsContent value="report" className="w-full">
          <TransferReportsTab
            transfers={transfers}
            expenses={expenses}
            loading={loading}
            onExportCSV={onExportCSV}
            onPrint={onPrint}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
